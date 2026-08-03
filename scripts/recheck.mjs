// Focused recheck: fixed hero/nav/cursor + resume print emulation.
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = process.argv[2] || "qa-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

async function ctxPage(vp) {
  const ctx = await browser.newContext({ viewport: vp });
  await ctx.addInitScript(() => {
    localStorage.setItem("portfolio-theme", "light");
    sessionStorage.setItem("ledger-intro-seen", "1");
  });
  return [ctx, await ctx.newPage()];
}

// 1. hero viewport shot (no scroll) — headline fit + no phantom cursor ring
{
  const [ctx, page] = await ctxPage({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/recheck-hero-desktop.png` });
  await ctx.close();
}

// 2. mobile nav
{
  const [ctx, page] = await ctxPage({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/recheck-nav-mobile.png`, clip: { x: 0, y: 0, width: 390, height: 260 } });
  await ctx.close();
}

// 3. resume print emulation
{
  const [ctx, page] = await ctxPage({ width: 1000, height: 1400 });
  await page.goto("http://localhost:3000/resume", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(1500);
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/recheck-resume-print.png`, fullPage: true });
  await ctx.close();
}

await browser.close();
console.log("recheck done");
