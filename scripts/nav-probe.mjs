import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
const p = await ctx.newPage();
await p.goto("http://localhost:3000", { waitUntil:"load", timeout:60000 });
await p.waitForTimeout(1500);
const info = await p.evaluate(() => {
  const header = document.querySelector('header');
  const contact = [...document.querySelectorAll('a')].find(a => a.textContent.trim()==='Contact');
  const vw = window.innerWidth;
  return {
    vw,
    contactRight: contact ? Math.round(contact.getBoundingClientRect().right) : 'none',
    contactLeft: contact ? Math.round(contact.getBoundingClientRect().left) : 'none',
    overflow: contact ? Math.round(contact.getBoundingClientRect().right) > vw : 'none',
  };
});
console.log(JSON.stringify(info));
await b.close();
