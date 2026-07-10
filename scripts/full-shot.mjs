import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on("pageerror", e => console.log("PAGEERR:", e.message));
await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(3500);
// move mouse to trigger cursor trail + gaze
await page.mouse.move(1100, 300);
await page.mouse.move(1200, 500, { steps: 8 });
await page.waitForTimeout(800);
await page.screenshot({ path: ".verify/hero-horror.png" });
// scroll to the marquee/stats region
await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: ".verify/marquee-horror.png" });
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.62, behavior: "instant" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: ".verify/stats-horror.png" });
console.log("shots done");
await browser.close();
