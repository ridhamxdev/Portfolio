import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../.verify");
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE || "http://localhost:3000";
const pages = [
  ["home", "/"],
  ["projects", "/projects"],
  ["about", "/about"],
  ["detail", "/projects/synapse"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });

for (const [name, path] of pages) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
  } catch (e) {
    console.log(`NAV-ERR ${name}: ${e.message}`);
  }
  await page.waitForTimeout(4000); // let 3D + animations settle
  await page.screenshot({ path: `${OUT}/${name}.png` });
  // also a full-page for the home to see all sections
  if (name === "home" || name === "projects") {
    await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
  }
  console.log(`=== ${name} (${path}) ===`);
  console.log(errors.length ? errors.slice(0, 12).join("\n") : "no console errors");
  await page.close();
}

await browser.close();
console.log("VERIFY DONE");
