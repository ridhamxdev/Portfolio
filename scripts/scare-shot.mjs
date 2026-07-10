import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs=[]; page.on("pageerror",e=>errs.push(e.message));
await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(2800);
// scroll into the trigger window and force the armed fire by simulating multiple loads
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight*0.55, behavior:'instant'}));
await page.waitForTimeout(600);
// It may or may not fire (random). Force-render the exact skull markup to verify look:
await page.evaluate(() => {
  const wrap = document.createElement('div');
  wrap.style.cssText='position:fixed;inset:0;z-index:400;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000';
  wrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="130vmin" height="130vmin" viewBox="0 0 24 24" fill="none" stroke="#d7d0c6" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" style="width:130vmin;height:130vmin;transform:scale(1.9);filter:drop-shadow(0 0 8vmin rgba(193,18,31,0.9))"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"/></svg>
  <div style="position:absolute;inset:0;background:rgba(193,18,31,0.3);mix-blend-mode:multiply"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 45vmin rgba(0,0,0,0.96)"></div>`;
  document.body.appendChild(wrap);
});
await page.waitForTimeout(300);
await page.screenshot({ path: ".verify/jumpscare-skull.png" });
console.log("ERR:", errs.join("|")||"none");
await browser.close();
