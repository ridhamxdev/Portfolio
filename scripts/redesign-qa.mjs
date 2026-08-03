// QA sweep for the LEDGER redesign: every route, both worlds, two viewports.
// Usage: node scripts/redesign-qa.mjs [outDir]
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = process.argv[2] || "qa-shots";
mkdirSync(OUT, { recursive: true });

const routes = [
  ["home", "/"],
  ["projects", "/projects"],
  ["project-enamdoc", "/projects/enamdoc"],
  ["about", "/about"],
  ["resume", "/resume"],
];
const themes = ["light", "dark"];
const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
];

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

const problems = [];

for (const [themeName] of themes.map((t) => [t])) {
  for (const [vpName, vp] of viewports) {
    const ctx = await browser.newContext({ viewport: vp });
    await ctx.addInitScript(
      ([theme]) => {
        localStorage.setItem("portfolio-theme", theme);
        sessionStorage.setItem("ledger-intro-seen", "1"); // skip preloader
      },
      [themeName]
    );
    const page = await ctx.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") problems.push(`[console] ${themeName}/${vpName} ${page.url()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => problems.push(`[pageerror] ${themeName}/${vpName} ${page.url()}: ${e.message}`));

    for (const [name, path] of routes) {
      try {
        await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 45000 });
        await page.waitForTimeout(1800);
        // walk the page so IO reveals fire, then return to top
        await page.evaluate(async () => {
          const step = window.innerHeight * 0.8;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 220));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(1200);
        await page.screenshot({
          path: `${OUT}/${name}-${themeName}-${vpName}.png`,
          fullPage: true,
          timeout: 45000,
        });
        // horizontal overflow check
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        if (overflow > 1) problems.push(`[overflow-x] ${themeName}/${vpName} ${path}: ${overflow}px`);
        console.log(`ok ${name} ${themeName} ${vpName}`);
      } catch (e) {
        problems.push(`[nav] ${themeName}/${vpName} ${path}: ${e.message}`);
      }
    }
    await ctx.close();
  }
}

await browser.close();
console.log(problems.length ? `\nPROBLEMS:\n${problems.join("\n")}` : "\nNo problems detected.");
