import { chromium } from "playwright";
const browser = await chromium.launch();
async function shot(name, url, vp, mobile) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: !!mobile, hasTouch: !!mobile,
    userAgent: mobile ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148" : undefined });
  const page = await ctx.newPage();
  const errs=[]; page.on("pageerror",e=>errs.push(e.message));
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(5200);
  await page.screenshot({ path: `.verify/fix-${name}.png` });
  console.log(`${name}: errs=${errs.length}`);
  await ctx.close();
}
await shot("m-home", "http://localhost:3000", {width:390,height:844}, true);
await shot("m-home-360", "http://localhost:3000", {width:360,height:800}, true);
await browser.close();
