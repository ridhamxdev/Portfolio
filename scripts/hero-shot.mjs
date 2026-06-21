import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 820 }, deviceScaleFactor: 1.5 });
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(4500); // let intro + 3D settle
await page.screenshot({ path: ".verify/hero-new.png" });
console.log("shot done");
await browser.close();
