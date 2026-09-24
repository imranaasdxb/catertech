import { config } from "dotenv";
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const isApply = process.argv.includes("--apply");
const isDryRun = !isApply;
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const concurrencyArg = process.argv.find((arg) => arg.startsWith("--concurrency="));
const mapArg = process.argv.find((arg) => arg.startsWith("--map="));

const limit = limitArg ? Math.max(1, Number(limitArg.split("=")[1])) : Infinity;
const concurrency = concurrencyArg ? Math.max(1, Number(concurrencyArg.split("=")[1])) : 5;
const mapPath = mapArg?.split("=").slice(1).join("=") || "scripts/r2-imagekit-migration-map.json";

const databaseUrl = process.env.DATABASE_URL;
const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing.");
}

if (isApply && !imagekitPrivateKey) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is missing.");
}

const sql = neon(databaseUrl);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isR2Url(url) {
  return typeof url === "string" && url.includes(".r2.dev/");
}

function imageKitAuthHeader() {
  return `Basic ${Buffer.from(`${imagekitPrivateKey}:`).toString("base64")}`;
}

function imageKitPathFromUrl(url) {
  const parsed = new URL(url);
  const normalized = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");
  const slashIndex = normalized.lastIndexOf("/");
  const folder = slashIndex === -1 ? "/" : `/${normalized.slice(0, slashIndex)}`;
  const fileName = basename(normalized || "file").replace(/[^\w.\-]/g, "_") || "file";
  return { folder, fileName };
}

async function retry(label, fn, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(600 * attempt);
    }
  }
  throw new Error(`${label} failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

async function uploadR2UrlToImageKit(url) {
  const { folder, fileName } = imageKitPathFromUrl(url);
  const downloaded = await retry(`Download ${url}`, async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return {
      bytes: new Uint8Array(await response.arrayBuffer()),
      contentType: response.headers.get("content-type") || "application/octet-stream",
    };
  });

  const form = new FormData();
  form.append("file", new Blob([downloaded.bytes], { type: downloaded.contentType }), fileName);
  form.append("fileName", fileName);
  form.append("folder", folder);
  form.append("useUniqueFileName", "false");

  return retry(`ImageKit upload ${fileName}`, async () => {
    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: { Authorization: imageKitAuthHeader() },
      body: form,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(typeof data.message === "string" ? data.message : `HTTP ${response.status}`);
    }
    if (!data.url) throw new Error("ImageKit did not return a URL.");
    return { url: data.url, fileId: data.fileId, filePath: data.filePath };
  });
}

async function mapLimit(items, workerCount, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  await Promise.all(
    Array.from({ length: Math.min(workerCount, items.length) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await worker(items[index], index);
      }
    })
  );
  return results;
}

async function readExistingMap() {
  try {
    const raw = await readFile(mapPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.urls === "object" && parsed.urls ? parsed.urls : {};
  } catch {
    return {};
  }
}

async function writeMap(urls, extra = {}) {
  await writeFile(
    mapPath,
    JSON.stringify(
      {
        migratedAt: new Date().toISOString(),
        imageCount: Object.keys(urls).length,
        urls,
        ...extra,
      },
      null,
      2
    )
  );
}

const rows = await sql`
  select id, title, images
  from products
  where exists (
    select 1 from unnest(images) as image_url
    where image_url like '%.r2.dev/%'
  )
  order by updated_at desc, id asc
`;

const products = rows
  .map((row) => ({
    id: row.id,
    title: row.title,
    images: row.images ?? [],
    r2Images: (row.images ?? []).filter(isR2Url),
  }))
  .filter((row) => row.r2Images.length > 0)
  .slice(0, limit);

const uniqueR2Urls = [...new Set(products.flatMap((row) => row.r2Images))];

console.log(`${isDryRun ? "Dry run" : "Apply"} mode`);
console.log(`Products with R2 images: ${products.length}`);
console.log(`Unique R2 image URLs: ${uniqueR2Urls.length}`);

if (isDryRun) {
  for (const product of products.slice(0, 10)) {
    console.log(`- ${product.title} (${product.r2Images.length})`);
  }
  console.log("No files uploaded and Neon was not updated. Run with --apply to migrate.");
  process.exit(0);
}

const migrated = await readExistingMap();
const failed = [];
const pendingUrls = uniqueR2Urls.filter((url) => !migrated[url]);

if (pendingUrls.length !== uniqueR2Urls.length) {
  console.log(`Using existing migration map: ${uniqueR2Urls.length - pendingUrls.length} URLs already mapped.`);
}

await mapLimit(pendingUrls, concurrency, async (url, index) => {
  console.log(`[${index + 1}/${pendingUrls.length}] Migrating ${url}`);
  try {
    const result = await uploadR2UrlToImageKit(url);
    migrated[url] = result.url;
    await writeMap(migrated, { status: "uploading" });
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failed.push({ url, message });
    console.error(`Failed ${url}: ${message}`);
    await writeMap(migrated, { status: "uploading", failed });
    return null;
  }
});

let updatedProducts = 0;
for (const product of products) {
  const nextImages = product.images.map((url) => migrated[url] ?? url);
  const changed = nextImages.some((url, index) => url !== product.images[index]);
  if (!changed) continue;
  await sql`
    update products
    set images = ${nextImages}, updated_at = now()
    where id = ${product.id}
  `;
  updatedProducts += 1;
  console.log(`Updated ${product.title}`);
}

await writeMap(migrated, {
  status: failed.length ? "completed_with_failures" : "completed",
  updatedProducts,
  failed,
});

console.log(`Done. Updated products: ${updatedProducts}`);
console.log(`Migration map saved to ${mapPath}`);
if (failed.length) {
  console.log(`Failed images: ${failed.length}. Re-run the same command later to retry only failed/unmapped URLs.`);
}
