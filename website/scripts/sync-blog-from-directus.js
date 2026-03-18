import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDirectus, staticToken, rest, readItems } from "@directus/sdk";

function parseEnvFile(content) {
  const map = {};
  const lines = String(content || "").split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    map[key] = value;
  }

  return map;
}

async function getDirectusEnv(websiteRoot) {
  let directusUrl = process.env.PUBLIC_DIRECTUS_URL || "";
  let directusKey = process.env.PUBLIC_DIRECTUS_KEY || "";

  if (directusUrl && directusKey) {
    return { directusUrl, directusKey };
  }

  const envPath = path.join(websiteRoot, ".env");
  let envContent = "";

  try {
    envContent = await fs.readFile(envPath, "utf8");
  } catch (error) {
    envContent = "";
  }

  const envFileMap = parseEnvFile(envContent);

  if (!directusUrl) {
    directusUrl = envFileMap.PUBLIC_DIRECTUS_URL || "";
  }

  if (!directusKey) {
    directusKey = envFileMap.PUBLIC_DIRECTUS_KEY || "";
  }

  if (!directusUrl || !directusKey) {
    throw new Error(
      "Missing Directus credentials. Set PUBLIC_DIRECTUS_URL and PUBLIC_DIRECTUS_KEY in env or website/.env."
    );
  }

  return { directusUrl, directusKey };
}

function toYamlValue(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(String(value));
}

function buildFrontmatter(article, bannerPath, bannerOgPath) {
  const lines = ["---"];

  lines.push(`id: ${toYamlValue(article.id)}`);
  lines.push(`status: ${toYamlValue(article.status || "draft")}`);
  lines.push(`sort: ${toYamlValue(article.sort === undefined ? null : article.sort)}`);
  lines.push(`date_created: ${toYamlValue(article.date_created || null)}`);
  lines.push(`date_updated: ${toYamlValue(article.date_updated || null)}`);
  lines.push(`title: ${toYamlValue(article.title || "")}`);
  lines.push(`subtitle: ${toYamlValue(article.subtitle || null)}`);
  lines.push(`slug: ${toYamlValue(article.slug || "")}`);
  lines.push(`category: ${toYamlValue(article.category || null)}`);
  lines.push(`banner: ${toYamlValue(bannerPath || null)}`);
  lines.push(`banner_og: ${toYamlValue(bannerOgPath || null)}`);
  lines.push(`banner_id: ${toYamlValue(article.banner || null)}`);
  lines.push(`banner_og_id: ${toYamlValue(article.banner_og || null)}`);
  lines.push("---");
  lines.push("");

  return lines.join("\n");
}

function getFileExtensionFromResponse(response, sourceUrl) {
  const contentTypeHeader = response.headers.get("content-type") || "";
  const contentType = contentTypeHeader.split(";")[0].trim().toLowerCase();

  if (contentType === "image/webp") {
    return "webp";
  }
  if (contentType === "image/png") {
    return "png";
  }
  if (contentType === "image/jpeg") {
    return "jpg";
  }
  if (contentType === "image/gif") {
    return "gif";
  }
  if (contentType === "image/svg+xml") {
    return "svg";
  }

  let pathname = "";
  try {
    pathname = new URL(sourceUrl).pathname || "";
  } catch (error) {
    pathname = "";
  }

  const extension = path.extname(pathname).replace(".", "").toLowerCase();
  if (extension) {
    return extension;
  }

  return "bin";
}

function normalizeSlug(value) {
  if (!value) {
    return "";
  }

  return String(value).trim();
}

function extractInlineAssets(markdown) {
  const list = [];
  const pattern = /https?:\/\/[^)\s"'`]+\/assets\/([a-zA-Z0-9-]+)(\?[^)\s"'`]*)?/gi;
  let match = pattern.exec(markdown);

  while (match) {
    list.push({
      url: match[0],
      assetId: match[1],
    });
    match = pattern.exec(markdown);
  }

  return list;
}

function replaceAll(input, findValue, replaceValue) {
  return String(input || "").split(findValue).join(replaceValue);
}

async function ensureCleanDirectories(contentDir, imagesDir) {
  await fs.rm(contentDir, { recursive: true, force: true });
  await fs.rm(imagesDir, { recursive: true, force: true });
  await fs.mkdir(contentDir, { recursive: true });
  await fs.mkdir(imagesDir, { recursive: true });
}

function buildDirectusAssetUrl(directusUrl, assetId) {
  return new URL(`/assets/${assetId}`, directusUrl).toString();
}

async function downloadAsset({
  sourceUrl,
  postSlug,
  fileBaseName,
  postImagesDir,
  downloadedUrls,
  directusKey,
  directusUrl,
  fallbackAssetId,
}) {
  if (downloadedUrls[sourceUrl]) {
    return downloadedUrls[sourceUrl];
  }

  const originalSourceUrl = sourceUrl;
  let finalSourceUrl = sourceUrl;
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${directusKey}`,
    },
  };

  let response = await fetch(finalSourceUrl, requestOptions);

  if (!response.ok && finalSourceUrl.includes("?")) {
    const fallbackSourceUrl = finalSourceUrl.split("?")[0];
    response = await fetch(fallbackSourceUrl, requestOptions);

    if (response.ok) {
      finalSourceUrl = fallbackSourceUrl;
    }
  }

  if (!response.ok && directusUrl && fallbackAssetId) {
    const directusAssetUrl = buildDirectusAssetUrl(directusUrl, fallbackAssetId);
    response = await fetch(directusAssetUrl, requestOptions);

    if (response.ok) {
      finalSourceUrl = directusAssetUrl;
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to download ${originalSourceUrl} (HTTP ${response.status})`);
  }

  const extension = getFileExtensionFromResponse(response, finalSourceUrl);
  const fileName = `${fileBaseName}.${extension}`;
  const filePath = path.join(postImagesDir, fileName);
  const content = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filePath, content);

  const webPath = `/images/blog/${postSlug}/${fileName}`;
  downloadedUrls[originalSourceUrl] = webPath;
  downloadedUrls[finalSourceUrl] = webPath;
  return webPath;
}

function getPostOutput(markdown, replacements) {
  let output = String(markdown || "");

  for (let i = 0; i < replacements.length; i++) {
    output = replaceAll(output, replacements[i].from, replacements[i].to);
  }

  return output;
}

async function run() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const websiteRoot = path.resolve(__dirname, "..");
  const contentDir = path.join(websiteRoot, "src/content/blog");
  const imagesRoot = path.join(websiteRoot, "public/images/blog");

  const { directusUrl, directusKey } = await getDirectusEnv(websiteRoot);

  console.log("[sync:blog] cleaning output directories");
  await ensureCleanDirectories(contentDir, imagesRoot);

  console.log("[sync:blog] fetching articles from Directus");
  const client = createDirectus(directusUrl).with(staticToken(directusKey)).with(rest());
  let articles = await client.request(readItems("article", { limit: -1 }));

  if (!Array.isArray(articles)) {
    articles = [];
  }

  let skippedNoSlug = 0;
  let exported = 0;
  let imageErrors = 0;

  console.log(`[sync:blog] fetched ${articles.length} article row(s)`);

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i] || {};
    const slug = normalizeSlug(article.slug);

    if (!slug) {
      skippedNoSlug += 1;
      console.log(`[sync:blog] skipped row ${article.id || "unknown"} (missing slug)`);
      continue;
    }

    const postImagesDir = path.join(imagesRoot, slug);
    await fs.mkdir(postImagesDir, { recursive: true });

    const downloadedUrls = {};
    let bannerPath = null;
    let bannerOgPath = null;

    if (article.banner) {
      const bannerUrl = buildDirectusAssetUrl(directusUrl, article.banner);
      try {
        bannerPath = await downloadAsset({
          sourceUrl: bannerUrl,
          postSlug: slug,
          fileBaseName: "banner",
          postImagesDir,
          downloadedUrls,
          directusKey,
          directusUrl,
        });
      } catch (error) {
        imageErrors += 1;
        console.warn(`[sync:blog] banner download failed for ${slug}: ${error.message}`);
      }
    }

    if (article.banner_og) {
      const bannerOgUrl = buildDirectusAssetUrl(directusUrl, article.banner_og);
      try {
        bannerOgPath = await downloadAsset({
          sourceUrl: bannerOgUrl,
          postSlug: slug,
          fileBaseName: "banner-og",
          postImagesDir,
          downloadedUrls,
          directusKey,
          directusUrl,
        });
      } catch (error) {
        imageErrors += 1;
        console.warn(`[sync:blog] banner_og download failed for ${slug}: ${error.message}`);
      }
    }

    const markdown = String(article.content_markdown || "");
    const inlineAssets = extractInlineAssets(markdown);
    const replacements = [];

    for (let j = 0; j < inlineAssets.length; j++) {
      const item = inlineAssets[j];
      try {
        const localWebPath = await downloadAsset({
          sourceUrl: item.url,
          postSlug: slug,
          fileBaseName: `inline-${item.assetId}`,
          postImagesDir,
          downloadedUrls,
          directusKey,
          directusUrl,
          fallbackAssetId: item.assetId,
        });

        replacements.push({
          from: item.url,
          to: localWebPath,
        });
      } catch (error) {
        imageErrors += 1;
        console.warn(`[sync:blog] inline image download failed for ${slug}: ${error.message}`);
      }
    }

    const rewrittenMarkdown = getPostOutput(markdown, replacements);
    const frontmatter = buildFrontmatter(article, bannerPath, bannerOgPath);
    const filePath = path.join(contentDir, `${slug}.md`);

    let fileContents = frontmatter;
    if (rewrittenMarkdown) {
      fileContents += `${rewrittenMarkdown}\n`;
    }

    await fs.writeFile(filePath, fileContents, "utf8");
    exported += 1;
    console.log(`[sync:blog] wrote ${slug}.md`);
  }

  console.log(`[sync:blog] done. exported=${exported} skippedNoSlug=${skippedNoSlug} imageErrors=${imageErrors}`);
}

run().catch((error) => {
  console.error("[sync:blog] failed:", error.message);
  process.exit(1);
});
