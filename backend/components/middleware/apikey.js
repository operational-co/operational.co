import accessCheck from "#lib/access-check.js";
import config from "#lib/config.js";
import Key from "#services/key/index.js";
import prisma from "#lib/prisma.js";

const USER_SELECT = {
  id: true,
  createdAt: true,
  primaryWorkspace: true,
  firstName: true,
  lastName: true,
  activated: true,
  onboarded: true,
  status: true,
};

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
    // Example: { key: 'ops_xxx', workspaceId: 1, notifiers: [1] }
    if (!keyInfo || keyInfo.valid === false) {
      return res.status(401).json({ message: "api key invalid" });
    }
    if (!keyInfo.workspaceId) {
      return res.status(403).json({ message: "no workspace associated with api key" });
    }

    // ---- find a user for this workspace ----
    let user = null;

    // 1) Try workspace adminId
    const ws = await prisma.workspace.findUnique({
      where: { id: keyInfo.workspaceId },
      select: {
        adminId: true,
      },
    });

    if (ws?.adminId) {
      user = await prisma.user.findUnique({
        where: { id: ws.adminId },
        select: USER_SELECT,
      });
    }

    // 2) If no admin user, try an ADMIN role in WorkspaceUser
    if (!user) {
      const wuAdmin = await prisma.workspaceUser.findFirst({
        where: { workspaceId: keyInfo.workspaceId, role: "ADMIN" },
        select: { user: { select: USER_SELECT } },
        orderBy: { createdAt: "asc" },
      });
      user = wuAdmin?.user || null;
    }

    // 3) Fallback: any member of the workspace
    if (!user) {
      const wuAny = await prisma.workspaceUser.findFirst({
        where: { workspaceId: keyInfo.workspaceId },
        select: { user: { select: USER_SELECT } },
        orderBy: { createdAt: "asc" },
      });
      user = wuAny?.user || null;
    }

    if (!user) {
      return res.status(403).json({ message: "no user found for workspace" });
    }

    // shape it exactly as requested and attach to res.locals
    const newUser = {
      id: user.id,
      createdAt: user.createdAt,
      primaryWorkspace: user.primaryWorkspace,
      firstName: user.firstName,
      lastName: user.lastName,
      activated: user.activated,
      onboarded: user.onboarded,
      status: user.status,
    };

    res.locals.user = newUser;

    // also attach key bits if handy downstream
    req.apiKey = apiKey;
    req.keyInfo = keyInfo;

    return next();
  } catch (err) {
    console.error("[auth]", err);
    return res.status(500).json({ message: "internal server error" });
  }
}

export default auth;
