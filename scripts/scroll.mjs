import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../.verify");
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";
const tag = process.env.T || "home";
const routes = { home: "/", projects: "/projects", about: "/about" };
const path = routes[tag] || "/";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 });
const page = await ctx.newPage();
await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(2500);

const steps = Number(process.env.N || 6);
for (let i = 0; i < steps; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), i * 820);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${OUT}/${tag}-${i}.png` });
}
console.log("scrolled", tag);
await browser.close();
