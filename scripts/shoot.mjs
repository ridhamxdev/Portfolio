// Capture clean hero screenshots of live project demos for the 3D gallery.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/projects");
mkdirSync(OUT, { recursive: true });

const shots = [
  ["intellidash", "https://intellidash-ten.vercel.app"],
  ["energence", "https://energence-ochre.vercel.app"],
  ["crm", "https://crm-for-lead-generation-jl4b.vercel.app"],
  ["bookit", "https://bookit-app-eta.vercel.app"],
  ["chatlive", "https://chat-live-mauve.vercel.app"],
  ["swappable", "https://swappable-service.vercel.app"],
  ["erino", "https://erino-task.vercel.app"],
  ["nerdmatrix", "https://nerdmatrix.vercel.app"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const [slug, url] of shots) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }); } catch {}
  }
  await page.waitForTimeout(3500); // let fonts/animations settle
  const file = `${OUT}/${slug}.png`;
  try {
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log("OK  ", slug, "->", file);
  } catch (e) {
    console.log("FAIL", slug, e.message);
  }
  await page.close();
}

await browser.close();
console.log("done");
