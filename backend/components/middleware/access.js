import accessCheck from "#lib/access-check.js";
import config from "#lib/config.js";

async function auth(req, res, next) {
  // No point if selfhosted
  if (config.SELFHOSTED) {
    next();
    return;
  }

  let data = await accessCheck(req.body.email);

  console.log(data);

  let isAllow = false;

  if (data && data.allow) {
    isAllow = true;
  }

  if (data && data.email) {
    req.body.email = data.email;
  }

  if (isAllow) {
    next();
    return;
  } else {
    res.status(400).send({
      message: "Something went wrong, try again later",
    });
    return;
  }
}

export default auth;
