import accessCheck from "#lib/access-check.js";
import config from "#lib/config.js";
import Key from "#services/key/index.js";

async function auth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "missing bearer token" });
    }

    const apiKey = auth.slice(7).trim();
    if (!apiKey) {
      return res.status(401).json({ message: "missing api key" });
    }

    // validate the key
    const keyInfo = await Key.validate(apiKey);
    if (!keyInfo || keyInfo.valid === false) {
      return res.status(401).json({ message: "api key invalid" });
    }

    // attach if useful downstream
    req.apiKey = apiKey;
    req.keyInfo = keyInfo;

    return next();
  } catch (err) {
    console.error("[auth]", err);
    return res.status(500).json({ message: "internal server error" });
  }
}

export default auth;
