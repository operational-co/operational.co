import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const methods = ["get", "post", "put", "patch", "delete", "options", "head", "trace"];

function toKebab(value) {
  if (!value) {
    return "";
  }

  const text = String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase();

  if (!text) {
    return "endpoint";
  }

  return text;
}

function toYamlString(value) {
  if (value === null || value === undefined) {
    return '""';
  }
  return JSON.stringify(String(value));
}

function getPrimaryTag(operation) {
  if (operation && Array.isArray(operation.tags) && operation.tags[0]) {
    return operation.tags[0];
  }
  return "API";
}

function getOperationSlug(operation, method, endpointPath) {
  if (operation && operation.operationId) {
    return toKebab(operation.operationId);
  }

  return toKebab(`${method}-${endpointPath}`);
}

function normalizeCodeLang(value) {
  const lower = String(value || "").toLowerCase();

  if (lower === "javascript") {
    return "javascript";
  }
  if (lower === "js") {
    return "javascript";
  }
  if (lower === "shell") {
    return "bash";
  }
  if (lower === "sh") {
    return "bash";
  }
  if (lower === "bash") {
    return "bash";
  }

  return toKebab(value || "txt");
}

function getSchemaLine(schema) {
  if (!schema) {
    return "No schema provided.";
  }

  if (schema.$ref) {
    return `Schema: \`${schema.$ref}\``;
  }

  if (schema.type) {
    return `Schema type: \`${schema.type}\``;
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return "Schema: oneOf";
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return "Schema: anyOf";
  }

  return "Schema provided.";
}

function extractExample(contentType) {
  if (!contentType) {
    return null;
  }

  if (contentType.example !== undefined) {
    return contentType.example;
  }

  if (contentType.examples && typeof contentType.examples === "object") {
    const names = Object.keys(contentType.examples);
    if (names.length > 0) {
      const first = contentType.examples[names[0]];
      if (first && first.value !== undefined) {
        return first.value;
      }
    }
  }

  return null;
}

function buildRequestBodyText(operation) {
  if (!operation || !operation.requestBody) {
    return "## Request body\n\nNo request body.\n";
  }

  const body = operation.requestBody;
  const content = body.content || {};
  const contentTypes = Object.keys(content);

  if (contentTypes.length === 0) {
    return "## Request body\n\nNo request body content types.\n";
  }

  let text = "## Request body\n\n";

  if (body.required) {
    text += "Required: `true`\n\n";
  } else {
    text += "Required: `false`\n\n";
  }

  for (let i = 0; i < contentTypes.length; i++) {
    const type = contentTypes[i];
    const typeData = content[type] || {};

    text += `### ${type}\n\n`;
    text += `${getSchemaLine(typeData.schema)}\n\n`;

    const example = extractExample(typeData);
    if (example !== null) {
      if (typeof example === "string") {
        text += "```txt\n";
        text += `${example}\n`;
        text += "```\n\n";
      } else {
        text += "```json\n";
        text += `${JSON.stringify(example, null, 2)}\n`;
        text += "```\n\n";
      }
    }
  }

  return text;
}

function buildSecurityText(operation) {
  if (!operation || !Array.isArray(operation.security) || operation.security.length === 0) {
    return "## Authentication\n\nNo authentication declared.\n";
  }

  const names = [];

  for (let i = 0; i < operation.security.length; i++) {
    const item = operation.security[i];
    const keys = Object.keys(item || {});

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      if (names.indexOf(key) === -1) {
        names.push(key);
      }
    }
  }

  if (names.length === 0) {
    return "## Authentication\n\nNo authentication declared.\n";
  }

  let text = "## Authentication\n\n";

  for (let i = 0; i < names.length; i++) {
    text += `- \`${names[i]}\`\n`;
  }

  text += "\n";

  return text;
}

function buildResponsesText(operation) {
  if (!operation || !operation.responses || typeof operation.responses !== "object") {
    return "## Responses\n\nNo responses declared.\n";
  }

  const statuses = Object.keys(operation.responses);

  if (statuses.length === 0) {
    return "## Responses\n\nNo responses declared.\n";
  }

  statuses.sort(function (a, b) {
    const aText = String(a);
    const bText = String(b);

    if (aText < bText) {
      return -1;
    }
    if (aText > bText) {
      return 1;
    }
    return 0;
  });

  let text = "## Responses\n\n";

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    const response = operation.responses[status] || {};

    text += `### ${status}\n\n`;
    text += `${response.description || "No description."}\n\n`;

    const content = response.content || {};
    const contentTypes = Object.keys(content);
    for (let j = 0; j < contentTypes.length; j++) {
      const type = contentTypes[j];
      const typeData = content[type] || {};
      text += `- ${type}: ${getSchemaLine(typeData.schema)}\n`;
    }

    if (contentTypes.length > 0) {
      text += "\n";
    }
  }

  return text;
}

function buildCodeSamplesText(operation) {
  const samples = operation && Array.isArray(operation["x-codeSamples"]) ? operation["x-codeSamples"] : [];

  if (samples.length === 0) {
    return "";
  }

  let text = "## Code samples\n\n";

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i] || {};
    const label = sample.label || sample.lang || `Sample ${i + 1}`;
    const lang = normalizeCodeLang(sample.lang || "txt");

    text += `### ${label}\n\n`;
    text += "```";
    text += `${lang}\n`;
    text += `${sample.source || ""}\n`;
    text += "```\n\n";
  }

  return text;
}

function buildMarkdown(operation, method, endpointPath) {
  const summary = operation.summary || `${method.toUpperCase()} ${endpointPath}`;
  const description = operation.description || summary;

  let text = "";
  text += `${description}\n\n`;
  text += "## Endpoint\n\n";
  text += `- Method: \`${method.toUpperCase()}\`\n`;
  text += `- Path: \`${endpointPath}\`\n\n`;
  text += buildSecurityText(operation);
  text += buildRequestBodyText(operation);
  text += buildResponsesText(operation);
  text += buildCodeSamplesText(operation);

  return {
    title: summary,
    description,
    body: text,
  };
}

function buildFrontmatter(data) {
  const lines = [];

  lines.push("---");
  lines.push(`title: ${toYamlString(data.title)}`);
  lines.push(`slug: ${toYamlString(data.slug)}`);
  lines.push(`description: ${toYamlString(data.description)}`);
  lines.push("tags:");
  lines.push(`  - ${toYamlString(data.tag)}`);
  lines.push("generatedFromOpenapi: true");
  lines.push(`method: ${toYamlString(data.method)}`);
  lines.push(`path: ${toYamlString(data.path)}`);
  lines.push(`operationId: ${toYamlString(data.operationId)}`);
  lines.push("---");
  lines.push("");

  return lines.join("\n");
}

async function removeFileIfExists(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (!error || error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function cleanupStaleGeneratedFiles(apiDir, generatedSlugs) {
  const files = await fs.readdir(apiDir);

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];

    if (!fileName.endsWith(".md") && !fileName.endsWith(".mdx")) {
      continue;
    }

    const filePath = path.join(apiDir, fileName);
    const fileContent = await fs.readFile(filePath, "utf8");

    if (fileContent.indexOf("generatedFromOpenapi: true") === -1) {
      continue;
    }

    const fileSlug = fileName.replace(/\.mdx?$/, "");
    if (generatedSlugs.indexOf(fileSlug) === -1) {
      await fs.unlink(filePath);
      console.log(`[generate:api-docs] removed stale generated file: ${fileName}`);
    }
  }
}

async function fetchSpec(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  const spec = await response.json();
  return spec;
}

async function run() {
  const openapiUrl = process.env.OPENAPI_URL || "https://api.operational.co/openapi.json";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const websiteRoot = path.resolve(__dirname, "..");
  const apiDir = path.join(websiteRoot, "src/content/api");

  let spec = null;

  try {
    spec = await fetchSpec(openapiUrl);
  } catch (error) {
    console.warn(`[generate:api-docs] warning: failed to fetch ${openapiUrl}`);
    console.warn(`[generate:api-docs] ${error.message}`);
    console.warn("[generate:api-docs] keeping existing API docs");
    return;
  }

  if (!spec || !spec.paths || typeof spec.paths !== "object") {
    console.warn("[generate:api-docs] warning: spec has no paths, keeping existing API docs");
    return;
  }

  const generatedSlugs = [];
  const endpointPaths = Object.keys(spec.paths);

  endpointPaths.sort(function (a, b) {
    const aText = String(a);
    const bText = String(b);
    if (aText < bText) {
      return -1;
    }
    if (aText > bText) {
      return 1;
    }
    return 0;
  });

  for (let i = 0; i < endpointPaths.length; i++) {
    const endpointPath = endpointPaths[i];
    const endpointData = spec.paths[endpointPath] || {};

    for (let j = 0; j < methods.length; j++) {
      const method = methods[j];
      const operation = endpointData[method];

      if (!operation || typeof operation !== "object") {
        continue;
      }

      const slug = getOperationSlug(operation, method, endpointPath);
      const primaryTag = getPrimaryTag(operation);
      const operationId = operation.operationId || slug;

      const markdown = buildMarkdown(operation, method, endpointPath);
      const frontmatter = buildFrontmatter({
        title: markdown.title,
        slug,
        description: markdown.description,
        tag: primaryTag,
        method: method.toUpperCase(),
        path: endpointPath,
        operationId,
      });

      const output = `${frontmatter}${markdown.body.trim()}\n`;
      const outputFile = path.join(apiDir, `${slug}.mdx`);
      const sameSlugMd = path.join(apiDir, `${slug}.md`);

      await removeFileIfExists(outputFile);
      await removeFileIfExists(sameSlugMd);
      await fs.writeFile(outputFile, output, "utf8");

      generatedSlugs.push(slug);
      console.log(`[generate:api-docs] wrote ${path.basename(outputFile)}`);
    }
  }

  await cleanupStaleGeneratedFiles(apiDir, generatedSlugs);

  console.log(`[generate:api-docs] done. generated ${generatedSlugs.length} file(s)`);
}

run().catch(function (error) {
  console.error("[generate:api-docs] failed:", error);
  process.exit(1);
});
