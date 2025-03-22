import prisma from "#lib/prisma.js";
import deepEmailValidator from "deep-email-validator";
import dns from "dns";

/**
 * A very thorough utility to check if a user is banned or not,
 *
 * email = email of the user
 * ip = ip, can be user's ip, their domain's ip, etc
 * thorough = if true, will also check if email is 10minutemail, takes longer but good for restricting signups
 */
export default async function (email, ip = null, thorough = false) {
  //first check if is disposable email
  let condition = await deepEmailValidator.validate({
    email,
    validateTypo: false,
  });

  const isValid = condition.validators.disposable.valid;

  if (!isValid) {
    throw `Disposable emails aren't allowed`;
  }

  let splits = email.split("@");

  if (!splits[1]) {
    throw "Email is invalid";
  }

  let domain = splits[1];

  await isManuallyBanned(email, ip).catch((err) => {
    throw err;
  });

  if (thorough) {
    await check10MinuteMail(domain).catch((err) => {
      throw err;
    });
  }

  return true;
}

async function isManuallyBanned(email, ip) {
  let domain = email.split("@")[1];

  let bans = await prisma.banList.findMany({
    where: {
      text: email,
      type: "EMAIL",
    },
  });

  if (bans.length > 0) {
    throw "Email is banned";
  }

  bans = await prisma.banList.findMany({
    where: {
      text: domain,
      type: "DOMAIN",
    },
  });

  if (bans.length > 0) {
    throw "Email by domain ban not allowed";
  }

  if (!ip) {
    return false;
  }

  bans = await prisma.banList.findMany({
    where: {
      text: ip,
      type: "IP",
    },
  });

  if (bans.length > 0) {
    throw `Email by IP ban is not allowed`;
  }
}

async function check10MinuteMail(domain) {
  let bannedMx = ["mx.mail-data.net", "96-126-99-62.ip.linodeusercontent.com", "mx2.den.yt"];

  let bannedIps = [`24.144.64.177`, `	54.39.193.199`];

  let mx = await dns.promises.resolveMx(domain);
  let is10minuteMail = false;
  let primaryMx = null;

  if (mx && mx.length) {
    if (mx[0].exchange) {
      primaryMx = mx[0].exchange;
    }

    for (let i = 0; i < mx.length; i++) {
      let m = mx[i];

      if (!m.exchange) {
        continue;
      }

      if (bannedMx.includes(m.exchange)) {
        is10minuteMail = true;
        break;
      }
    }
  }

  if (is10minuteMail) {
    throw `Using 10 minute emails isn't allowed`;
  }

  // then check ip
  if (primaryMx) {
    let addr = await dns.promises.lookup(primaryMx);

    if (addr.address && bannedIps.includes(addr.address)) {
      throw `Email ban via IP not allowed`;
    }
  }

  return true;
}
