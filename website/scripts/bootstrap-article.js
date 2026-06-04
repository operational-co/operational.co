import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const modelName = "google/gemini-3.1-flash-image-preview";
const ogWidth = 1200;
const ogHeight = 675;
const ogPanelWidth = 525;
const ogImageWidth = ogWidth - ogPanelWidth;

function parseArgs(argv) {
  let args = {
    title: "",
    slug: "",
  };

  for (let i = 0; i < argv.length; i++) {
    let part = argv[i] || "";

    if (part.indexOf("--title=") === 0) {
      args.title = part.slice("--title=".length).trim();
      continue;
    }

    if (part === "--title") {
      args.title = String(argv[i + 1] || "").trim();
      i += 1;
      continue;
    }

    if (part.indexOf("--slug=") === 0) {
      args.slug = part.slice("--slug=".length).trim();
      continue;
    }

    if (part === "--slug") {
      args.slug = String(argv[i + 1] || "").trim();
      i += 1;
    }
  }

  return args;
}

function printUsageAndExit() {
  console.error("Usage: npm run bootstrap-article -- --title=\"My Title\"");
  console.error("   or: npm run bootstrap-article -- --slug=\"my-slug\"");
  console.error("   or: npm run bootstrap-article -- --title=\"My Title\" --slug=\"my-slug\"");
  process.exit(1);
}

function slugify(value) {
  let output = String(value || "").trim().toLowerCase();
  let from = "aaaaeeeeiiiioooouuuunc------";
  let to = "aaaaeeeeiiiioooouuuunc------";

  output = output.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (let i = 0; i < from.length; i++) {
    output = output.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  output = output
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/g, "")
    .replace(/-+$/g, "");

  return output;
}

function toTitleWord(value) {
  let lower = String(value || "").toLowerCase();

  if (lower === "api") {
    return "API";
  }
  if (lower === "b2b") {
    return "B2B";
  }
  if (lower === "saas") {
    return "SaaS";
  }
  if (lower === "og") {
    return "OG";
  }
  if (lower === "ui") {
    return "UI";
  }
  if (lower === "ux") {
    return "UX";
  }

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function deslugify(slug) {
  let parts = String(slug || "")
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  for (let i = 0; i < parts.length; i++) {
    parts[i] = toTitleWord(parts[i]);
  }

  return parts.join(" ");
}

function resolveArticleDetails(args) {
  let title = String(args.title || "").trim();
  let slug = String(args.slug || "").trim();

  if (!title && !slug) {
    printUsageAndExit();
  }

  if (title && !slug) {
    slug = slugify(title);
  }

  if (!title && slug) {
    title = deslugify(slug);
  }

  if (title && slug) {
    slug = slugify(slug);
  }

  if (!slug) {
    throw new Error("Could not resolve a slug from the provided arguments.");
  }

  if (!title) {
    throw new Error("Could not resolve a title from the provided arguments.");
  }

  return {
    title,
    slug,
  };
}

function parseEnvFile(content) {
  let map = {};
  let lines = String(content || "").split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line || line.charAt(0) === "#") {
      continue;
    }

    let separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    let key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
      (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'")
    ) {
      value = value.slice(1, -1);
    }

    map[key] = value;
  }

  return map;
}

async function getOpenRouterKey(websiteRoot) {
  let envPath = path.join(websiteRoot, ".env");
  let envContent = "";

  try {
    envContent = await fs.readFile(envPath, "utf8");
  } catch (error) {
    envContent = "";
  }

  let envMap = parseEnvFile(envContent);
  let apiKey = envMap.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || "";

  if (!apiKey) {
    throw new Error(
      "Missing OPENROUTER_API_KEY. Add it to website/.env or export it in your shell."
    );
  }

  return apiKey;
}

async function getNextArticleId(contentDir) {
  let list = await fs.readdir(contentDir);
  let maxId = 0;

  for (let i = 0; i < list.length; i++) {
    let fileName = list[i];

    if (!fileName.endsWith(".md")) {
      continue;
    }

    let filePath = path.join(contentDir, fileName);
    let content = await fs.readFile(filePath, "utf8");
    let match = content.match(/^id:\s*(\d+)/m);

    if (!match) {
      continue;
    }

    let currentId = Number(match[1]);

    if (currentId > maxId) {
      maxId = currentId;
    }
  }

  return maxId + 1;
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

function createArticleMarkdown(details) {
  let lines = ["---"];

  lines.push(`id: ${toYamlValue(details.id)}`);
  lines.push(`status: ${toYamlValue("draft")}`);
  lines.push(`sort: ${toYamlValue(null)}`);
  lines.push(`date_created: ${toYamlValue(details.isoDate)}`);
  lines.push(`date_updated: ${toYamlValue(details.isoDate)}`);
  lines.push(`title: ${toYamlValue(details.title)}`);
  lines.push(`subtitle: ${toYamlValue(null)}`);
  lines.push(`slug: ${toYamlValue(details.slug)}`);
  lines.push(`category: ${toYamlValue(null)}`);
  lines.push(`banner: ${toYamlValue(`/images/blog/${details.slug}/banner.png`)}`);
  lines.push(`banner_og: ${toYamlValue(`/images/blog/${details.slug}/banner-og.jpg`)}`);
  lines.push(`banner_id: ${toYamlValue(null)}`);
  lines.push(`banner_og_id: ${toYamlValue(null)}`);
  lines.push("---");
  lines.push("");
  lines.push("Write a short introduction here.");
  lines.push("");
  lines.push("## Main idea");
  lines.push("");
  lines.push("Add the first section of the article here.");
  lines.push("");
  lines.push("Wrap up the article here.");
  lines.push("");

  return lines.join("\n");
}

function buildBannerPrompt(title, slug) {
  let promptParts = [
    "Create a retro editorial illustration for a SaaS article banner.",
    `Article title: ${title}.`,
    `Article slug: ${slug}.`,
    "Use a clear business or software operations theme that fits the article.",
    "Use a strong central subject and simple background details.",
    "Make it feel like a polished magazine illustration with warm, slightly vintage colors.",
    "Do not include readable words, UI labels, logos, watermarks, or gibberish text inside the artwork.",
    "Square composition, high detail, clean edges, and suitable for a website article banner.",
  ];

  return promptParts.join(" ");
}

async function fetchGeneratedImage(apiKey, prompt) {
  let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      image_config: {
        aspect_ratio: "1:1",
      },
    }),
  });

  let json = await response.json().catch(() => {
    return {};
  });

  if (!response.ok) {
    let message = "OpenRouter image generation failed.";

    if (json && json.error && json.error.message) {
      message = json.error.message;
    }

    throw new Error(message);
  }

  let choice = json && json.choices && json.choices[0] ? json.choices[0] : null;
  let message = choice && choice.message ? choice.message : null;
  let images = message && message.images ? message.images : [];
  let firstImage = images[0] || null;
  let imageUrl = "";

  if (firstImage && firstImage.image_url && firstImage.image_url.url) {
    imageUrl = firstImage.image_url.url;
  } else if (firstImage && firstImage.imageUrl && firstImage.imageUrl.url) {
    imageUrl = firstImage.imageUrl.url;
  }

  if (!imageUrl || imageUrl.indexOf("data:image/") !== 0) {
    throw new Error("OpenRouter did not return an image payload.");
  }

  let match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    throw new Error("OpenRouter returned an unexpected image format.");
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function getImageExtension(mimeType) {
  if (mimeType === "image/png") {
    return "png";
  }
  if (mimeType === "image/webp") {
    return "webp";
  }
  if (mimeType === "image/jpeg") {
    return "jpg";
  }
  return "png";
}

function runCommand(command, args) {
  execFileSync(command, args, {
    stdio: "inherit",
  });
}

async function normalizeBanner(tempInputPath, bannerPath) {
  runCommand("ffmpeg", [
    "-y",
    "-i",
    tempInputPath,
    "-vf",
    "scale=1024:1024:force_original_aspect_ratio=increase,crop=1024:1024",
    "-frames:v",
    "1",
    "-update",
    "1",
    bannerPath,
  ]);
}

function wrapText(input, maxLineLength) {
  let words = String(input || "").split(/\s+/).filter(Boolean);
  let lines = [];
  let current = "";

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let next = current ? `${current} ${word}` : word;

    if (next.length > maxLineLength && current) {
      lines.push(current);
      current = word;
      continue;
    }

    current = next;
  }

  if (current) {
    lines.push(current);
  }

  return lines.join("\n");
}

async function createOgCard(bannerPath, ogPath, title, slug) {
  let tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "bootstrap-article-og-"));
  let titlePath = path.join(tempDir, "title.txt");
  let bylinePath = path.join(tempDir, "byline.txt");
  let urlPath = path.join(tempDir, "url.txt");
  let urlText = `https://operational.co/articles/${slug}`;
  let wrappedTitle = wrapText(title, 24);
  let titleLines = wrappedTitle.split("\n").length;
  let titleY = 96;
  let titleFontSize = 44;
  let titleLineSpacing = 14;
  let titleBlockHeight = titleLines * (titleFontSize + titleLineSpacing);
  let bylineY = titleY + titleBlockHeight + 28;
  let urlY = bylineY + 72;

  await fs.writeFile(titlePath, wrappedTitle, "utf8");
  await fs.writeFile(bylinePath, "By Shash", "utf8");
  await fs.writeFile(urlPath, wrapText(urlText, 34), "utf8");

  let filters = [
    `[1:v]scale=${ogImageWidth}:${ogHeight}[right]`,
    `[0:v][right]overlay=${ogPanelWidth}:0[panel]`,
    `[panel]drawtext=fontfile=/System/Library/Fonts/Supplemental/Georgia.ttf:textfile='${titlePath}':fontcolor=black:fontsize=${titleFontSize}:line_spacing=${titleLineSpacing}:x=40:y=${titleY}[title]`,
    `[title]drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:textfile='${bylinePath}':fontcolor=black:fontsize=24:x=40:y=${bylineY}[byline]`,
    `[byline]drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:textfile='${urlPath}':fontcolor=black:fontsize=22:line_spacing=10:x=40:y=${urlY}`,
  ];

  runCommand("ffmpeg", [
    "-y",
    "-f",
    "lavfi",
    "-i",
    `color=c=white:s=${ogWidth}x${ogHeight}`,
    "-i",
    bannerPath,
    "-filter_complex",
    filters.join(";"),
    "-frames:v",
    "1",
    "-update",
    "1",
    "-q:v",
    "2",
    ogPath,
  ]);

  await fs.rm(tempDir, { recursive: true, force: true });
}

async function main() {
  let args = parseArgs(process.argv.slice(2));
  let article = resolveArticleDetails(args);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const websiteRoot = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(websiteRoot, "..");
  const contentDir = path.join(websiteRoot, "src/content/blog");
  const imageDir = path.join(websiteRoot, "public/images/blog", article.slug);
  const articlePath = path.join(contentDir, `${article.slug}.md`);
  const bannerPath = path.join(imageDir, "banner.png");
  const ogPath = path.join(imageDir, "banner-og.jpg");

  try {
    await fs.access(articlePath);
    throw new Error(`Article already exists at ${path.relative(repoRoot, articlePath)}.`);
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }

  try {
    await fs.access(imageDir);
    throw new Error(`Image directory already exists at ${path.relative(repoRoot, imageDir)}.`);
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }

  const apiKey = await getOpenRouterKey(websiteRoot);
  let nextId = await getNextArticleId(contentDir);
  let prompt = buildBannerPrompt(article.title, article.slug);
  let generatedImage = await fetchGeneratedImage(apiKey, prompt);
  let tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "bootstrap-article-"));
  let tempImagePath = path.join(tempDir, `generated.${getImageExtension(generatedImage.mimeType)}`);
  let now = new Date().toISOString();

  await fs.writeFile(tempImagePath, generatedImage.buffer);
  await fs.mkdir(imageDir, { recursive: true });

  try {
    await normalizeBanner(tempImagePath, bannerPath);
    await createOgCard(bannerPath, ogPath, article.title, article.slug);

    let markdown = createArticleMarkdown({
      id: nextId,
      isoDate: now,
      title: article.title,
      slug: article.slug,
    });

    await fs.writeFile(articlePath, markdown, "utf8");
  } catch (error) {
    await fs.rm(imageDir, { recursive: true, force: true });
    throw error;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }

  console.log(`[bootstrap-article] created ${path.relative(repoRoot, articlePath)}`);
  console.log(`[bootstrap-article] created ${path.relative(repoRoot, bannerPath)}`);
  console.log(`[bootstrap-article] created ${path.relative(repoRoot, ogPath)}`);
}

main().catch((error) => {
  console.error("[bootstrap-article] failed:", error.message);
  process.exit(1);
});
