import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../.verify");
const BASE = "http://localhost:3000";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 });

// projects gallery (should open on EnamDoc)
let p = await ctx.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push("PAGEERR " + e.message));
await p.goto(BASE + "/projects", { waitUntil: "networkidle", timeout: 45000 });
await p.waitForTimeout(5500);
await p.screenshot({ path: `${OUT}/new-projects.png` });
console.log("projects errs:", errs.length ? errs.join("; ") : "none");
await p.close();

// EnamDoc detail
p = await ctx.newPage();
await p.goto(BASE + "/projects/enamdoc", { waitUntil: "networkidle", timeout: 45000 });
await p.waitForTimeout(2500);
await p.screenshot({ path: `${OUT}/new-enamdoc-top.png` });
await p.evaluate(() => window.scrollTo({ top: 760, behavior: "instant" }));
await p.waitForTimeout(1200);
await p.screenshot({ path: `${OUT}/new-enamdoc-body.png` });
await p.close();

// home featured list
p = await ctx.newPage();
await p.goto(BASE + "/", { waitUntil: "networkidle", timeout: 45000 });
await p.waitForTimeout(2500);
await p.evaluate(() => window.scrollTo({ top: 1700, behavior: "instant" }));
await p.waitForTimeout(1400);
await p.screenshot({ path: `${OUT}/new-home-featured.png` });
await p.close();

await browser.close();
console.log("CHECK DONE");
