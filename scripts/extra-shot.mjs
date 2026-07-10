import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on("pageerror", e => console.log("PAGEERR:", e.message));
// home — check audio toggle bottom-right + deep-scroll dread
await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.9, behavior: "instant" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: ".verify/dread-deep.png" });
// projects page
await page.goto("http://localhost:3000/projects", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(3500);
await page.screenshot({ path: ".verify/projects-horror.png" });
console.log("shots done");
await browser.close();
