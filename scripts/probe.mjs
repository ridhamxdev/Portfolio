import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 });
await p.waitForTimeout(3000);
const data = await p.evaluate(() => {
  const el = [...document.querySelectorAll('h1 .accent-text, .horror-glitch')][0];
  const cs = el ? getComputedStyle(el) : null;
  const root = getComputedStyle(document.documentElement);
  return {
    invisibleColor: cs ? cs.color : "no el",
    accentVar: root.getPropertyValue('--color-accent').trim() || root.getPropertyValue('--accent').trim(),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  };
});
console.log(JSON.stringify(data,null,2));
// also check if a canvas is present + has drawn (face)
const canvasInfo = await p.evaluate(() => {
  const c = document.querySelector('canvas');
  return c ? { w: c.width, h: c.height } : "no canvas";
});
console.log("canvas:", JSON.stringify(canvasInfo));
await b.close();
