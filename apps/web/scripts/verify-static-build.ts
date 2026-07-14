import { readFile } from "node:fs/promises";
import { mkCombosEnv } from "@mk-combos/contracts/env/value";

const entryFile = new URL("../dist/client/index.html", import.meta.url);

let entryHtml: string;

try {
  entryHtml = await readFile(entryFile, "utf8");
} catch (error) {
  throw new Error("Cannot read static entry file: dist/client/index.html", {
    cause: error,
  });
}

const assetUrls = Array.from(
  entryHtml.matchAll(/(?:href|src)="([^"]+)"/g),
  (match) => match[1],
).flatMap((url) => (url?.includes("/assets/") === true ? [url] : []));

if (assetUrls.length === 0) {
  throw new Error("The static entry file does not reference built assets");
}

const expectedAssetPrefix = `${mkCombosEnv.viteBase}assets/`;
const invalidAssetUrls = assetUrls.filter((url) => !url.startsWith(expectedAssetPrefix));

if (invalidAssetUrls.length > 0) {
  throw new Error(`Built assets must use ${expectedAssetPrefix}: ${invalidAssetUrls.join(", ")}`);
}

console.log(
  `Verified ${assetUrls.length} asset references with ${expectedAssetPrefix} in dist/client/index.html`,
);
