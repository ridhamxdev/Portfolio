import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/projects");
mkdirSync(OUT, { recursive: true });

const shots = [
  ["dreamtouch", "https://dreamtouch-client.vercel.app"],
  ["enamdoc", "https://enam-doc.vercel.app"],
  ["desifood", "https://desi-food-next-js-local.vercel.app"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

for (const [slug, url] of shots) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    try { await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }); } catch {}
  }
  try { await page.waitForFunction(() => !/loading/i.test(document.body.innerText || ""), { timeout: 9000 }); } catch {}
  await page.waitForTimeout(4500);
  try {
    await page.screenshot({ path: `${OUT}/${slug}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log("OK  ", slug);
  } catch (e) { console.log("FAIL", slug, e.message); }
  await page.close();
}
await browser.close();
console.log("done");
