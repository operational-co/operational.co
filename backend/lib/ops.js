import Operational from "@operational.co/sdk";
import config from "#lib/config.js";

let ops = null;

function parseString(input) {
  if (!input) {
    return null;
  }

  const allowedParts = ["avatar", "content", "contextStart", "contextId", "type"];

  const result = {};
  const words = []; // To store the name parts

  // Split the string into parts by space
  const parts = input.split(" ");

  // Iterate over the parts and process key-value pairs or name-value
  parts.forEach((part) => {
    // Check if there's a colon indicating a key-value pair
    if (part.includes(":")) {
      const [key, value] = part.split(":");

      if (allowedParts.includes(key)) {
        result[key] = value;
      } else {
        words.push(part); // Treat as part of the name if the key is invalid
      }
    } else {
      words.push(part); // Collect all non-key-value parts as name
    }
  });

  // Join all name parts with spaces
  if (words.length > 0) {
    result.name = words.join(" ");
  }

  return result;
}

const log = async function (str) {
  const payload = parseString(str);

  if (!payload) {
    console.error("No string passed in ops.log");
  }

  return await this.events.ingest(payload);
};

if (config.operational.TOKEN) {
  const test = process.env.NODE_ENV !== "production" ? true : false;
  Operational.prototype.log = log;
  const baseUrl = config.operational.BASEURL || undefined;
  ops = new Operational(config.operational.TOKEN, {
    test,
    baseUrl,
  });
} else {
  ops = {
    events: {
      ingest: () => {},
    },
    log: () => {},
  };
}

export default ops;
