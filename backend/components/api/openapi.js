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
    `OpenAPI JSON: ${buildServerUrl(req)}/openapi.json`,
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
  const logEventActionSchema = {
    type: "object",
    additionalProperties: false,
    required: ["url", "buttonText"],
    properties: {
      key: {
        type: "string",
        description: "Optional unless external=true. Internal action key used for tracking.",
      },
      url: {
        type: "string",
        format: "uri",
        description: "Required. URL that will run when the action button is clicked.",
      },
      buttonText: {
        type: "string",
        maxLength: 48,
        description: "Required. Label shown on the action button (max 48 chars).",
      },
      external: {
        type: "boolean",
        default: false,
        description: "Optional. Set true if this links out and does not require a key.",
      },
      repeat: {
        type: "boolean",
        description: "Optional. true makes action repeatable. Omitted/false is single-use.",
      },
      expireIn: {
        type: "integer",
        minimum: 1,
        description: "Optional. Action expiry in minutes. Defaults to 10080 (7 days).",
      },
      meta: {
        oneOf: [{ type: "object" }, { type: "null" }],
        description: "Optional metadata object attached to the action.",
      },
    },
  };

  const logEventRowItemSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      type: {
        type: "string",
        enum: ["text", "map", "image", "json"],
        default: "text",
        description: "Optional. Card type for rows payloads.",
      },
      label: {
        type: "string",
        description: "Optional. Label displayed beside row content.",
      },
      content: {
        oneOf: [{ type: "string" }, { type: "object" }, { type: "array" }],
        description: "Optional. Row content. Defaults to empty string when omitted.",
      },
    },
  };

  const logEventPayloadSchema = {
    type: "object",
    additionalProperties: false,
    anyOf: [{ required: ["name"] }, { required: ["content"] }],
    properties: {
      userId: {
        type: "string",
        description: "Optional. External user id associated with the event.",
      },
      name: {
        type: "string",
        maxLength: 48,
        description: "Optional unless content is missing. Event title (truncated to 48 chars).",
      },
      type: {
        type: "string",
        enum: ["text", "rows", "json", "image", "map"],
        default: "text",
        description: "Optional. Rendering mode for content.",
      },
      content: {
        oneOf: [
          { type: "string" },
          { type: "object" },
          { type: "array", items: { $ref: "#/components/schemas/LogEventRowItem" } },
        ],
        description:
          "Optional unless name is missing. Payload body. For type=rows, pass an array of row cards.",
      },
      actions: {
        type: "array",
        items: { $ref: "#/components/schemas/LogEventAction" },
        description: "Optional. Action buttons shown on the event.",
      },
      avatar: {
        type: "string",
        description: "Optional. Emoji or short avatar text (example: :), :warning:, :white_check_mark:).",
      },
      muted: {
        type: "boolean",
        default: false,
        description: "Optional. Reserved for compatibility; currently ignored by ingestion.",
      },
      notify: {
        type: "boolean",
        default: false,
        description: "Optional. Send push notification when true.",
      },
      test: {
        type: "boolean",
        default: false,
        description: "Optional. Marks event as test data.",
      },
      contextId: {
        type: "string",
        description: "Optional. Group related events together.",
      },
      contextStart: {
        type: "boolean",
        default: false,
        description: "Optional. Marks this event as the start of a context thread.",
      },
      category: {
        type: "string",
        maxLength: 24,
        description: "Optional. Category label used for filtering (truncated to 24 chars).",
      },
    },
  };

  return {
    openapi: "3.1.0",
    info: {
      title: "Operational Events API",
      version: "1.0.2",
      description:
        "OpenAPI spec for the production event logging endpoint used by @operational.co/sdk.\n\nLLM markdown: /llms.txt",
    },
    tags: [
      {
        name: "API",
        description: "Core ingestion endpoints. Additional API endpoints can be added here.",
      },
    ],
    servers: [
      {
        url: serverUrl,
        description: "Current deployment",
      },
    ],
    paths: {
      "/api/v1/log": {
        post: {
          tags: ["API"],
          summary: "Log event",
          description: "Create an event in Operational. Send either `name`, `content`, or both.",
          operationId: "logEvent",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LogEventPayload" },
                examples: {
                  basic: {
                    summary: "Basic text event",
                    value: {
                      name: "user signed up",
                      avatar: ":)",
                      content: "Someone signed up",
                    },
                  },
                  rowsWithActions: {
                    summary: "Rows event with actions and context",
                    value: {
                      name: "payment failed",
                      type: "rows",
                      avatar: ":warning:",
                      notify: true,
                      contextId: "invoice_9383",
                      contextStart: true,
                      category: "billing",
                      content: [
                        { label: "Customer", content: "anna@example.com" },
                        { label: "Amount", content: "$39.00" },
                        { label: "Reason", content: "card_declined" },
                      ],
                      actions: [
                        {
                          key: "retry-payment",
                          url: "https://api.your-domain.com/actions/retry-payment?invoice=9383",
                          buttonText: "Retry payment",
                        },
                      ],
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
                  schema: {
                    type: "string",
                    example: "content field is required",
                  },
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
                "await ops.events.log({",
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
      schemas: {
        LogEventPayload: logEventPayloadSchema,
        LogEventAction: logEventActionSchema,
        LogEventRowItem: logEventRowItemSchema,
      },
    },
  };
}
