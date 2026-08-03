import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:390,height:844} }); // no isMobile — true narrow browser
const p = await ctx.newPage();
await p.goto("http://localhost:3000", { waitUntil:"load", timeout:60000 });
await p.waitForTimeout(2000);
const info = await p.evaluate(() => {
  const de = document.documentElement;
  const overflow = de.scrollWidth > de.clientWidth;
  // find elements wider than viewport
  const vw = de.clientWidth;
  const wide = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      wide.push({ tag: el.tagName, cls: (el.className+'').slice(0,50), right: Math.round(r.right), left: Math.round(r.left) });
    }
  });
  return { vw, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, overflow, wideCount: wide.length, wide: wide.slice(0,8) };
});
console.log(JSON.stringify(info,null,2));
await b.close();
