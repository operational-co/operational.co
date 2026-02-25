function buildServerUrl(req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const forwardedHost = req.headers["x-forwarded-host"];

  const protocol = forwardedProto ? forwardedProto.split(",")[0].trim() : req.protocol || "https";
  const host = forwardedHost ? forwardedHost.split(",")[0].trim() : req.get("host");

  if (!host) {
    return "/";
  }

  return `${protocol}://${host}`;
}

let scalarMarkdownDisabled = false;

export async function buildApiV1LogLlmsMarkdown(req) {
  const spec = buildApiV1LogOpenApi(req);
  let generated = "";
  if (!scalarMarkdownDisabled) {
    try {
      const { createMarkdownFromOpenApi } = await import("@scalar/openapi-to-markdown");
      generated = await createMarkdownFromOpenApi(spec);
    } catch (err) {
      scalarMarkdownDisabled = true;
      console.log("[llms] scalar markdown generation failed; switching to fallback renderer");
      console.log(err);
    }
  }

  if (!generated) {
    generated = buildFallbackMarkdown(spec);
  }

  const lines = [
    "# Operational API (LLMs)",
    "",
    "This file is generated from the OpenAPI definition for Operational's API.",
    "",
    `OpenAPI JSON: ${buildServerUrl(req)}/api/v1/openapi.json`,
    "",
    generated.trim(),
    "",
  ];

  return lines.join("\n");
}

function buildFallbackMarkdown(spec) {
  const operation = spec?.paths?.["/api/v1/log"]?.post;
  if (!operation) {
    return "# API\n\nNo operations found.\n";
  }

  const sampleRequest =
    operation.requestBody?.content?.["application/json"]?.examples?.basic?.value;
  const jsonSample = sampleRequest ? JSON.stringify(sampleRequest, null, 2) : "{}";

  const codeSamples = Array.isArray(operation["x-codeSamples"]) ? operation["x-codeSamples"] : [];
  const codeBlocks = codeSamples
    .map((sample) => {
      const lang = sample.lang?.toLowerCase() === "shell" ? "bash" : "javascript";
      return `### ${sample.label || sample.lang}\n\n\`\`\`${lang}\n${sample.source || ""}\n\`\`\`\n`;
    })
    .join("\n");

  return [
    `# ${spec.info?.title || "API"}`,
    "",
    spec.info?.description || "",
    "",
    "## Authentication",
    "",
    "Use a bearer API key in the Authorization header.",
    "",
    "## Endpoint",
    "",
    "### POST /api/v1/log",
    "",
    operation.description || "",
    "",
    "### Request Body (application/json)",
    "",
    "```json",
    jsonSample,
    "```",
    "",
    "### Responses",
    "",
    "- 201: Event created",
    "- 400: Invalid payload",
    "- 401: Authorization failed",
    "",
    "## Code Samples",
    "",
    codeBlocks.trim(),
    "",
  ].join("\n");
}

export function buildApiV1LogOpenApi(req) {
  const serverUrl = buildServerUrl(req);

  return {
    openapi: "3.1.0",
    info: {
      title: "Operational Events API",
      version: "1.0.1",
      description:
        "OpenAPI spec for the production event ingestion endpoint used by @operational.co/sdk.\n\nLLM markdown: /llms.txt",
    },
    servers: [
      {
        url: serverUrl,
        description: "Current deployment",
      },
    ],
    paths: {
      "/api/v1/log": {
        post: {
          tags: ["Events"],
          summary: "Ingest event",
          description:
            "Create an event in Operational. This is the endpoint used by the SDK's ops.events.ingest().",
          operationId: "ingestEvent",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    userId: { type: "string" },
                    name: { type: "string", description: "Event title." },
                    type: {
                      type: "string",
                      enum: ["text", "rows", "json", "image", "map", "cards"],
                      description: "Rendering mode for content. `cards` is normalized to `rows`.",
                    },
                    content: {
                      oneOf: [{ type: "string" }, { type: "object" }, { type: "array" }],
                      description:
                        "Event payload. Max content length is validated server-side based on event store.",
                    },
                    actions: {
                      oneOf: [{ type: "array", items: { type: "object" } }, { type: "string" }],
                    },
                    avatar: { type: "string", description: "Emoji or short avatar text." },
                    muted: { type: "boolean", default: false },
                    notify: { type: "boolean", default: false },
                    test: { type: "boolean", default: false },
                    contextId: { type: "string" },
                    contextStart: { type: "boolean", default: false },
                    category: { type: "string" },
                  },
                },
                examples: {
                  basic: {
                    summary: "Basic event",
                    value: {
                      name: "user signed up",
                      avatar: ":)",
                      content: "Someone signed up",
                    },
                  },
                },
              },
              "text/plain": {
                schema: {
                  type: "string",
                  description:
                    "Plain-text shortcut. Leading emoji is parsed as avatar and the rest as event name.",
                },
                examples: {
                  simple: {
                    summary: "Plain text event",
                    value: ":) user signed up",
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Event created",
              content: {
                "text/plain": {
                  schema: { type: "string", example: "success" },
                },
              },
            },
            400: {
              description: "Invalid payload",
              content: {
                "text/plain": {
                  schema: { type: "string" },
                },
              },
            },
            401: {
              description: "Authorization failed",
              content: {
                "text/plain": {
                  schema: { type: "string", example: "bearer token missing" },
                },
              },
            },
          },
          "x-codeSamples": [
            {
              lang: "JavaScript",
              label: "SDK (@operational.co/sdk)",
              source: [
                'import Operational from "@operational.co/sdk";',
                "",
                'const ops = new Operational("API_KEY", {',
                "  // Optional: override per deployment",
                '  baseUrl: "https://api.your-domain.com",',
                "});",
                "",
                "await ops.events.ingest({",
                '  name: "user signed up",',
                '  avatar: ":)",',
                "});",
              ].join("\n"),
            },
            {
              lang: "Shell",
              label: "cURL",
              source: [
                'curl -X POST "https://api.your-domain.com/api/v1/log" \\',
                '  -H "Authorization: Bearer API_KEY" \\',
                '  -H "Content-Type: application/json" \\',
                '  -d \'{"name":"user signed up","avatar":":)"}\'',
              ].join("\n"),
            },
          ],
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "API Key",
          description: "Use your Operational API key as a Bearer token.",
        },
      },
    },
  };
}
