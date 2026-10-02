import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import prisma from "#lib/prisma.js";
import Db from "#services/db/index.js";
import config from "#lib/config.js";

const eventSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  content: z.any().nullable(),
  type: z.string(),
  muted: z.boolean(),
  test: z.boolean(),
  notify: z.boolean(),
  contextId: z.string().nullable(),
  contextType: z.number(),
  createdAt: z.string(),
  errors: z.string().nullable(),
  category: z.string().nullable(),
  actions: z.array(z.any()),
  contexts: z.array(z.any()),
});

const findEventsOutputSchema = z.object({
  items: z.array(eventSchema),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
  filtersUsed: z.object({
    query: z.string(),
    cursor: z.string().nullable(),
    skip: z.number(),
    limit: z.number(),
    mentions: z.array(z.string()),
    category: z.string().nullable(),
    muted: z.boolean(),
    contextId: z.string().nullable(),
    contextStart: z.boolean().nullable(),
    test: z.boolean(),
  }),
});

function normalizeActions(value) {
  const source = Array.isArray(value) ? value : [];
  const actions = [];

  for (let i = 0; i < source.length; i++) {
    let action = source[i];

    if (typeof action === "string") {
      try {
        action = JSON.parse(action);
      } catch (err) {
        action = null;
      }
    }

    if (!action || typeof action !== "object") {
      continue;
    }

    actions.push({
      id: action.id || null,
      key: action.key || null,
      slug: action.slug || null,
      status: action.status || null,
      repeat: action.repeat == null ? null : action.repeat,
      lastClicked: action.lastClicked || null,
    });
  }

  return actions;
}

function normalizeContent(event) {
  if ((event.type === "rows" || event.type === "json") && typeof event.content === "string") {
    try {
      return JSON.parse(event.content);
    } catch (err) {
      return event.content;
    }
  }

  return event.content == null ? null : event.content;
}

function toIsoString(value) {
  if (!value) {
    return new Date(0).toISOString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString();
}

function sanitizeEvent(event = {}, includeContexts = true) {
  const contexts = includeContexts && Array.isArray(event.contexts) ? event.contexts : [];

  return {
    id: String(event.id || ""),
    userId: event.userId == null ? null : String(event.userId),
    name: event.name == null ? null : String(event.name),
    avatar: event.avatar == null ? null : String(event.avatar),
    content: normalizeContent(event),
    type: String(event.type || "text"),
    muted: !!event.muted,
    test: !!event.test,
    notify: !!event.notify,
    contextId: event.contextId == null || event.contextId === "" ? null : String(event.contextId),
    contextType: Number(event.contextType || 0),
    createdAt: toIsoString(event.createdAt),
    errors: event.errors == null ? null : String(event.errors),
    category: event.category == null ? null : String(event.category),
    actions: normalizeActions(event.actions),
    contexts: contexts.map((item) => sanitizeEvent(item, false)),
  };
}

function success(data) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
    structuredContent: data,
  };
}

function normalizeFindArgs(args = {}) {
  const limit = args.limit == null ? config.events.take : Number(args.limit);
  const skip = args.skip == null ? 0 : Number(args.skip);
  const params = {
    query: String(args.query || "").trim(),
    cursor: args.cursor ? String(args.cursor) : undefined,
    skip,
    take: limit + 1,
    mentions: Array.isArray(args.mentions) ? args.mentions : [],
    category: args.category ? String(args.category) : "",
    muted: !!args.muted,
    contextId: args.contextId ? String(args.contextId) : "",
    test: !!args.test,
  };

  if (args.contextStart != null) {
    params.contextStart = !!args.contextStart;
  }

  return {
    params,
    limit,
  };
}

async function buildEventsContext(authContext) {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: Number(authContext.workspaceId),
    },
    select: {
      id: true,
      name: true,
      eventNames: true,
      categories: {
        orderBy: {
          text: "asc",
        },
        select: {
          text: true,
        },
      },
    },
  });

  return {
    workspace: workspace
      ? {
          id: workspace.id,
          name: workspace.name,
        }
      : null,
    categories: workspace ? workspace.categories.map((item) => item.text) : [],
    eventNames: workspace && Array.isArray(workspace.eventNames) ? workspace.eventNames : [],
    defaults: {
      limit: config.events.take,
      maxLimit: 100,
      muted: false,
      test: false,
    },
    filters: [
      "query",
      "cursor",
      "skip",
      "limit",
      "mentions",
      "category",
      "muted",
      "contextId",
      "contextStart",
      "test",
    ],
    pagination: {
      order: "newest_first",
      cursorField: "nextCursor",
      cursorType: "event_id",
    },
  };
}

async function findEvents(authContext, args) {
  const normalized = normalizeFindArgs(args);
  normalized.params.workspaceId = Number(authContext.workspaceId);

  const rows = await Db.find(normalized.params);
  const hasMore = rows.length > normalized.limit;
  const page = hasMore ? rows.slice(0, normalized.limit) : rows;
  const items = page.map((item) => sanitizeEvent(item));
  const lastItem = items.length ? items[items.length - 1] : null;

  return {
    items,
    nextCursor: hasMore && lastItem ? lastItem.id : null,
    hasMore,
    filtersUsed: {
      query: normalized.params.query,
      cursor: normalized.params.cursor || null,
      skip: normalized.params.skip,
      limit: normalized.limit,
      mentions: normalized.params.mentions.map((item) => String(item)),
      category: normalized.params.category || null,
      muted: normalized.params.muted,
      contextId: normalized.params.contextId || null,
      contextStart: normalized.params.contextStart == null ? null : normalized.params.contextStart,
      test: normalized.params.test,
    },
  };
}

async function getEvent(authContext, args) {
  const event = await Db.findOne(args.id, !!args.test, Number(authContext.workspaceId));

  if (!event) {
    const error = new Error("Event not found in the connected workspace");
    error.code = "event_not_found";
    throw error;
  }

  return {
    event: sanitizeEvent(event),
  };
}

export function createMcpServer(authContext) {
  const server = new McpServer(
    {
      name: "operational-mcp",
      version: "1.0.0",
    },
    {
      instructions:
        "Operational provides read-only access to events in the connected workspace. Call operational_events_context before searching when category or event-name context would help. Use operational_find_events for filtered browsing and operational_get_event for one known event id.",
    },
  );

  server.registerTool(
    "operational_events_context",
    {
      title: "Operational events context",
      description:
        "Returns the connected workspace, categories, cached event names, filter names, and pagination defaults. Call this before broad event exploration.",
      inputSchema: z.object({}).strict(),
      outputSchema: z.object({
        workspace: z
          .object({
            id: z.number(),
            name: z.string(),
          })
          .nullable(),
        categories: z.array(z.string()),
        eventNames: z.array(z.any()),
        defaults: z.any(),
        filters: z.array(z.string()),
        pagination: z.any(),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async function () {
      return success(await buildEventsContext(authContext));
    },
  );

  server.registerTool(
    "operational_find_events",
    {
      title: "Find Operational events",
      description:
        "Find events in the connected workspace. Supports all Operational event-feed filters and newest-first cursor pagination.",
      inputSchema: z
        .object({
          query: z
            .string()
            .max(1000)
            .optional()
            .describe("Case-insensitive text search over the event's searchable content."),
          cursor: z
            .string()
            .optional()
            .describe("Exclusive event id cursor returned by the previous page."),
          skip: z
            .number()
            .int()
            .min(0)
            .default(0)
            .describe("Number of matching events to skip. Prefer cursor pagination."),
          limit: z
            .number()
            .int()
            .min(1)
            .max(100)
            .default(config.events.take)
            .describe("Maximum events to return, from 1 to 100."),
          mentions: z
            .array(z.string())
            .optional()
            .describe("Only return events whose external userId is in this list."),
          category: z
            .string()
            .max(191)
            .optional()
            .describe("Only return events in this exact category."),
          muted: z
            .boolean()
            .default(false)
            .describe("False returns the live feed; true returns archived events."),
          contextId: z
            .string()
            .max(191)
            .optional()
            .describe("Only return events with this exact context id."),
          contextStart: z
            .boolean()
            .optional()
            .describe(
              "When provided, true returns context roots and false returns context children.",
            ),
          test: z
            .boolean()
            .default(false)
            .describe("False returns production events; true returns test-mode events."),
        })
        .strict(),
      outputSchema: findEventsOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async function (args) {
      return success(await findEvents(authContext, args));
    },
  );

  server.registerTool(
    "operational_get_event",
    {
      title: "Get Operational event",
      description: "Get one event and its contextual child events by id.",
      inputSchema: z
        .object({
          id: z.string().min(1),
          test: z.boolean().default(false),
        })
        .strict(),
      outputSchema: z.object({
        event: eventSchema,
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async function (args) {
      return success(await getEvent(authContext, args));
    },
  );

  return server;
}
