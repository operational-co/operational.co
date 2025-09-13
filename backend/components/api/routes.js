import express from "express";
import schemaMiddleware from "#lib/schema-middleware.js";
import component from "./index.js";
import Ingestion from "#services/ingestion/index.js";
import config from "#lib/config.js";

// Create a new router instance
const router = express.Router();

const identify = async (req, res) => {
  let authorization = req.headers.authorization;

  return res.status(200).send({});

  if (!authorization) {
    res.status(401);
    return res.send(`bearer token missing`);
  }

  let splits = authorization.split(" ");

  if (!splits[1]) {
    res.status(401);
    return res.send(`bearer token invalid`);
  }

  let apikey = splits[1];

  let payload = {
    ...req.body,
  };

  try {
    await Ingestion.identify(payload, apikey);
    res.code(201);
    return res.send("success");
  } catch (err) {
    console.log(err);
    res.code(401);
    return reply.send(err);
  }
};

const ingest = async (req, res) => {
  let authorization = req.headers.authorization;

  let len = req.headers["content-length"];

  const size = parseInt(len, 10);

  let maxLen = 100000;

  if (config.EVENT_STORE === "mysql") {
    maxLen = 6000;
  }

  //console.log(`REQUEST LENGTH: ${size}`);

  if (!authorization) {
    return res.status(401).send(`bearer token missing`);
  }

  let splits = authorization.split(" ");

  if (!splits[1]) {
    return res.status(401).send(`bearer token invalid`);
  }

  let temp = req.body.content;
  if (typeof temp === "object") {
    temp = JSON.stringify(temp);
  }
  if (typeof temp === "string") {
    //console.log(temp.length);

    if (temp.length >= maxLen) {
      return res
        .status(401)
        .send(`content length is more than ${maxLen} characters, trim the length`);
    }
  }

  let apikey = splits[1];

  let payload = {
    ...req.body,
  };

  try {
    await Ingestion.ingest(payload, apikey);
    res.status(201);
    return res.send("success");
  } catch (err) {
    console.log(`INGESTION ERROR`);
    console.log(err);
    console.log(payload);
    return res.status(400).send(err);
  }
};

const dashboardWidgetPush = async function (req, res) {};

const identifySchema = {
  schema: {
    userId: { type: "string" },
    email: {
      type: "string",
    },
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    avatar: {
      type: "string",
    },
    timezone: {
      type: "string",
    },
    test: {
      type: "boolean",
    },
  },
};

const ingestSchema = {
  schema: {
    userId: { type: "string" },
    name: {
      type: "string",
    },
    type: {
      type: "string",
    },
    content: {
      type: "string",
    },
    actions: {
      type: "string",
    },
    avatar: {
      type: "string",
    },
    muted: {
      type: "boolean",
    },
    test: {
      type: "boolean",
    },
    contextId: {
      type: "string",
      convert: true,
    },
    contextType: {
      type: "boolean",
    },
  },
};

const dashboardWidgetSchema = {
  schema: {
    widget: {
      type: "object",
    },
    data: {
      type: "any",
    },
  },
};

function extractFirstEmoji(str) {
  if (!str) return { emoji: null, text: str }; // Handle empty strings

  // Convert string into an array of characters (handles multi-byte emojis)
  const chars = Array.from(str);

  // Unicode emoji regex
  const emojiRegex =
    /[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;

  // Check if the first character is an emoji
  if (emojiRegex.test(chars[0])) {
    return {
      emoji: chars[0], // Extracted emoji
      text: chars.slice(1).join("").trim(), // Remaining text without emoji
    };
  }

  return { emoji: null, text: str };
}

function preSchemaValidation(req, res, next) {
  // Assume content type to be plain by default
  let contentType = req.headers["content-type"] && req.headers["content-type"].toLowerCase();

  if (contentType === "application/json") {
    next();
    return;
  }

  if (contentType === "text/plain" && typeof req.body === "string") {
    let emojiData = extractFirstEmoji(req.body);

    console.log(emojiData);

    req.body = {
      name: emojiData.text,
    };
    if (emojiData.emoji) {
      req.body.avatar = emojiData.emoji;
    }

    next();
  } else {
    res
      .status(400)
      .send("Missing or unacceptible content-type sent " + req.headers["content-type"]);
  }
}

// Middleware for the /api routes
router.post("/identify", schemaMiddleware(identifySchema), identify);

router.post(`/log`, preSchemaValidation, schemaMiddleware(ingestSchema), ingest);
router.post(`/ingest`, schemaMiddleware(ingestSchema), ingest);

router.post(
  `/dashboards/:dashboardId/widgets/:widgetId`,
  schemaMiddleware(dashboardWidgetSchema),
  dashboardWidgetPush,
);

// Export the router
export default router;
