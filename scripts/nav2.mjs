import { chromium } from "playwright";
const b = await chromium.launch();
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport:{width:w,height:800} });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000", { waitUntil:"load", timeout:60000 });
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => {
    const c = [...document.querySelectorAll('a')].find(a => a.textContent.trim()==='Contact');
    const r = c?.getBoundingClientRect();
    return { contactRight: r?Math.round(r.right):'none', vw: window.innerWidth, fits: r? r.right <= window.innerWidth : 'none' };
  });
  console.log(`w=${w}:`, JSON.stringify(info));
  await p.screenshot({ path: `.verify/nav-${w}.png`, clip:{x:0,y:0,width:w,height:80} });
  await ctx.close();
}
await b.close();
