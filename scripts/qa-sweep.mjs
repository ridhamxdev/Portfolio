import { chromium } from "playwright";
const browser = await chromium.launch();
const results = [];
async function shot(name, url, vp, scroll, mobile) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    isMobile: !!mobile,
    hasTouch: !!mobile,
    userAgent: mobile ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148" : undefined,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));
  page.on("console", m => { if (m.type() === "error") errs.push("console:" + m.text().slice(0,120)); });
  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(5000);
    if (scroll) { await page.evaluate((s) => window.scrollTo({top: document.body.scrollHeight*s, behavior:"instant"}), scroll); await page.waitForTimeout(1200); }
    await page.screenshot({ path: `.verify/qa-${name}.png` });
    results.push(`${name}: OK errs=${errs.length}${errs.length? " :: "+errs.slice(0,3).join(" | "):""}`);
  } catch (e) {
    results.push(`${name}: FAIL ${e.message.slice(0,80)}`);
  }
  await ctx.close();
}
// desktop
await shot("d-home", "http://localhost:3000", {width:1440,height:900}, 0, false);
await shot("d-projects", "http://localhost:3000/projects", {width:1440,height:900}, 0, false);
await shot("d-about", "http://localhost:3000/about", {width:1440,height:900}, 0, false);
await shot("d-casestudy", "http://localhost:3000/projects/enamdoc", {width:1440,height:900}, 0, false);
// mobile
await shot("m-home", "http://localhost:3000", {width:390,height:844}, 0, true);
await shot("m-home-scroll", "http://localhost:3000", {width:390,height:844}, 0.35, true);
await shot("m-projects", "http://localhost:3000/projects", {width:390,height:844}, 0, true);
await shot("m-about", "http://localhost:3000/about", {width:390,height:844}, 0, true);
await shot("m-footer", "http://localhost:3000", {width:390,height:844}, 1, true);
console.log(results.join("\n"));
await browser.close();
