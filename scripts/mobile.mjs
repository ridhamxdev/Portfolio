import { chromium, devices } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../.verify");
const BASE = "http://localhost:3000";

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
for (const [tag, path] of [["m-home", "/"], ["m-projects", "/projects"], ["m-about", "/about"]]) {
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${OUT}/${tag}.png` });
  await page.close();
}
console.log("mobile done");
await browser.close();
