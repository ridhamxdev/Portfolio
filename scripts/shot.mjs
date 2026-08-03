import { chromium } from "playwright";

const OUT = process.argv[2] || "hero.png";
const b = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.emulateMedia({ reducedMotion: "reduce" }); // calm CSS loops; 3D still renders
await p.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 });
// let the model load, textures decode, and a few frames render
await p.waitForTimeout(6000);
const canvas = await p.evaluate(() => {
  const c = document.querySelector("canvas");
  return c ? { w: c.width, h: c.height } : "no canvas";
});
console.log("canvas:", JSON.stringify(canvas));
await p.screenshot({ path: OUT, timeout: 60000, animations: "disabled" });
console.log("saved", OUT);
await b.close();
