import express from "express";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import prisma from "#lib/prisma.js";
import middlewareAuth from "#components/middleware/auth.js";
import { createMcpServer } from "./tools.js";
import {
  MCP_SCOPE,
  ACCESS_TOKEN_TTL_SECONDS,
  buildAccessToken,
  buildAuthorizationServerMetadata,
  buildBearerChallenge,
  buildCodeRecord,
  buildCompletionRecord,
  buildConsentUrl,
  buildFormPostHtml,
  buildProtectedResourceMetadata,
  buildRedirectUrl,
  buildServerCard,
  cleanupExpiredOauthRecords,
  consumeOauthRecord,
  createGrantData,
  findGrant,
  getBaseUrl,
  getMcpResource,
  oauthAccountHasAccess,
  parseRefreshToken,
  refreshSecretMatches,
  resolveConsentAccount,
  resolveOauthAccess,
  revokeGrant,
  rotateRefreshGrant,
  saveGrant,
  sendOauthError,
  validateOauthRequest,
  verifyAccessToken,
  verifyPkce,
} from "./oauth.js";

const router = express.Router();

function noStore(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
}

function requireBearer(req, res, next) {
  const authorization = String(req.headers.authorization || "");
  const parts = authorization.split(" ");
  const token = parts.length === 2 && parts[0].toLowerCase() === "bearer" ? String(parts[1]) : "";

  if (!token) {
    res.setHeader("WWW-Authenticate", buildBearerChallenge(req));
    return res.status(401).json({
      error: "invalid_token",
    });
  }

  return Promise.resolve()
    .then(async function () {
      const payload = verifyAccessToken(req, token);
      const auth = await resolveOauthAccess(req, payload);

      if (!auth) {
        throw new Error("Invalid token");
      }

      res.locals.mcpAuth = auth;
      req.auth = {
        token,
        clientId: auth.clientId,
        scopes: [MCP_SCOPE],
        expiresAt: Number(payload.exp),
        resource: new URL(getMcpResource(req)),
        extra: {
          userId: auth.userId,
          workspaceId: auth.workspaceId,
          grantId: auth.grantId,
        },
      };
      return next();
    })
    .catch(function () {
      res.setHeader("WWW-Authenticate", buildBearerChallenge(req, "invalid_token"));
      return res.status(401).json({
        error: "invalid_token",
      });
    });
}

router.get("/.well-known/oauth-authorization-server", function (req, res) {
  return res.status(200).json(buildAuthorizationServerMetadata(req));
});

router.get("/.well-known/oauth-authorization-server/mcp", function (req, res) {
  return res.status(200).json(buildAuthorizationServerMetadata(req));
});

router.get("/.well-known/oauth-protected-resource", function (req, res) {
  return res.status(200).json(buildProtectedResourceMetadata(req));
});

router.get("/.well-known/oauth-protected-resource/mcp", function (req, res) {
  return res.status(200).json(buildProtectedResourceMetadata(req));
});

router.get("/.well-known/mcp/server-card.json", function (req, res) {
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).json(buildServerCard(req));
});

router.get("/authorize", async function (req, res) {
  try {
    await cleanupExpiredOauthRecords();
    const request = await validateOauthRequest(req.query, req);
    return res.redirect(302, buildConsentUrl(request));
  } catch (err) {
    return sendOauthError(res, err);
  }
});

router.post("/authorize/details", middlewareAuth, async function (req, res) {
  try {
    const request = await validateOauthRequest(req.body, req);
    const account = await resolveConsentAccount(res.locals.user);

    if (!account) {
      return res.status(403).json({
        error: "access_denied",
        error_description: "Choose an active Operational workspace, then restart the connection.",
      });
    }

    const redirect = new URL(request.redirectUri);
    const redirectHostname = redirect.hostname.replace(/^\[/, "").replace(/\]$/, "");

    return res.status(200).json({
      clientName: request.clientName,
      clientHost: new URL(request.clientId).host,
      redirectHost: redirect.host,
      loopbackRedirect:
        redirectHostname === "localhost" ||
        redirectHostname === "127.0.0.1" ||
        redirectHostname === "::1",
      scope: request.scope,
      permissions: ["View events in the selected Operational workspace"],
      user: {
        email: account.userEmail,
      },
      workspace: {
        id: account.workspaceId,
        name: account.workspaceName,
      },
    });
  } catch (err) {
    return sendOauthError(res, err);
  }
});

router.post("/authorize/decision", middlewareAuth, async function (req, res) {
  try {
    await cleanupExpiredOauthRecords();
    const request = await validateOauthRequest(req.body, req);
    const account = await resolveConsentAccount(res.locals.user);
    const decision = String(req.body.decision || "").trim();

    if (decision !== "allow" && decision !== "deny") {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "decision must be allow or deny",
      });
    }

    if (!account) {
      return res.status(403).json({
        error: "access_denied",
        error_description: "Choose an active Operational workspace, then restart the connection.",
      });
    }

    const issuer = getBaseUrl(req);
    let responseFields = {
      state: request.state,
      iss: issuer,
    };
    const records = [];

    if (decision === "allow") {
      const codeRecord = buildCodeRecord({
        clientId: request.clientId,
        redirectUri: request.redirectUri,
        codeChallenge: request.codeChallenge,
        scope: request.scope,
        resource: request.resource,
        workspaceId: account.workspaceId,
        userId: account.userId,
      });
      records.push(codeRecord.data);
      responseFields = {
        ...responseFields,
        code: codeRecord.secret,
      };
    } else {
      responseFields = {
        ...responseFields,
        error: "access_denied",
        error_description: "The user declined the Operational connection.",
      };
    }

    const completionRecord = buildCompletionRecord({
      redirectUri: request.redirectUri,
      responseMode: request.responseMode,
      fields: responseFields,
    });
    records.push(completionRecord.data);

    await prisma.$transaction(
      records.map((data) =>
        prisma.verification.create({
          data,
        }),
      ),
    );

    return res.status(200).json({
      completionUrl: `${issuer}/authorize/complete?ticket=${encodeURIComponent(completionRecord.secret)}`,
    });
  } catch (err) {
    return sendOauthError(res, err);
  }
});

router.get("/authorize/complete", async function (req, res) {
  const ticket = String(req.query.ticket || "").trim();

  if (!ticket) {
    return res.status(400).json({
      error: "invalid_request",
    });
  }

  const completion = await consumeOauthRecord("completion", ticket);
  if (!completion) {
    return res.status(400).json({
      error: "invalid_request",
      error_description: "This authorization response has expired or was already used.",
    });
  }

  if (completion.responseMode === "form_post") {
    return res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(buildFormPostHtml(completion.redirectUri, completion.fields));
  }

  return res.redirect(302, buildRedirectUrl(completion.redirectUri, completion.fields));
});

router.post("/token", async function (req, res) {
  noStore(res);

  try {
    await cleanupExpiredOauthRecords();
    const grantType = String(req.body.grant_type || "").trim();
    const clientId = String(req.body.client_id || "").trim();
    const resource = String(req.body.resource || "").trim();

    if (!clientId || resource !== getMcpResource(req)) {
      return res.status(400).json({ error: "invalid_request" });
    }

    if (grantType === "authorization_code") {
      const code = String(req.body.code || "").trim();
      const redirectUri = String(req.body.redirect_uri || "").trim();
      const codeVerifier = String(req.body.code_verifier || "").trim();

      if (!code || !redirectUri || !codeVerifier) {
        return res.status(400).json({ error: "invalid_request" });
      }

      const codeRecord = await consumeOauthRecord("code", code);
      if (
        !codeRecord ||
        codeRecord.clientId !== clientId ||
        codeRecord.redirectUri !== redirectUri ||
        codeRecord.resource !== resource ||
        !verifyPkce(codeVerifier, codeRecord.codeChallenge)
      ) {
        return res.status(400).json({ error: "invalid_grant" });
      }

      if (!(await oauthAccountHasAccess(codeRecord.workspaceId, codeRecord.userId))) {
        return res.status(400).json({ error: "invalid_grant" });
      }

      const created = createGrantData(codeRecord, clientId, resource);
      await saveGrant(created.grant);

      return res.status(200).json({
        access_token: buildAccessToken(req, created.grant),
        refresh_token: created.refreshToken,
        token_type: "Bearer",
        expires_in: ACCESS_TOKEN_TTL_SECONDS,
        scope: created.grant.scope,
      });
    }

    if (grantType === "refresh_token") {
      const parsedRefresh = parseRefreshToken(req.body.refresh_token);

      if (!parsedRefresh) {
        return res.status(400).json({ error: "invalid_grant" });
      }

      const foundGrant = await findGrant(parsedRefresh.grantId);
      if (
        !foundGrant ||
        foundGrant.value.clientId !== clientId ||
        foundGrant.value.resource !== resource ||
        !refreshSecretMatches(foundGrant.value, parsedRefresh.secret)
      ) {
        if (foundGrant) {
          await revokeGrant(parsedRefresh.grantId);
        }
        return res.status(400).json({ error: "invalid_grant" });
      }

      if (!(await oauthAccountHasAccess(foundGrant.value.workspaceId, foundGrant.value.userId))) {
        await revokeGrant(parsedRefresh.grantId);
        return res.status(400).json({ error: "invalid_grant" });
      }

      const rotated = await rotateRefreshGrant(foundGrant);
      if (!rotated) {
        await revokeGrant(parsedRefresh.grantId);
        return res.status(400).json({ error: "invalid_grant" });
      }

      return res.status(200).json({
        access_token: buildAccessToken(req, rotated.grant),
        refresh_token: rotated.refreshToken,
        token_type: "Bearer",
        expires_in: ACCESS_TOKEN_TTL_SECONDS,
        scope: rotated.grant.scope,
      });
    }

    return res.status(400).json({
      error: "unsupported_grant_type",
    });
  } catch (err) {
    console.error("[mcp] token request failed", err);
    return res.status(500).json({
      error: "server_error",
    });
  }
});

router.post("/revoke", async function (req, res) {
  noStore(res);
  const token = String(req.body.token || "").trim();

  if (!token) {
    return res.status(200).end();
  }

  const refresh = parseRefreshToken(token);
  let grantId = "";

  if (refresh) {
    const foundGrant = await findGrant(refresh.grantId);
    if (foundGrant && refreshSecretMatches(foundGrant.value, refresh.secret)) {
      grantId = refresh.grantId;
    }
  }

  if (!grantId) {
    try {
      const payload = verifyAccessToken(req, token);
      grantId = String(payload.grantId || "").trim();
    } catch (err) {}
  }

  if (grantId) {
    await revokeGrant(grantId);
  }

  return res.status(200).end();
});

router.options("/mcp", function (req, res) {
  res.setHeader("Allow", "POST, OPTIONS");
  return res.sendStatus(204);
});

router.get("/mcp", function (req, res) {
  res.setHeader("Allow", "POST, OPTIONS");
  return res.status(405).json({
    error: "method_not_allowed",
    endpoint: "/mcp",
  });
});

router.post("/mcp", requireBearer, async function (req, res) {
  const authContext = res.locals.mcpAuth;
  const server = createMcpServer(authContext);
  const transport = new NodeStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  let closed = false;
  const close = function () {
    if (closed) {
      return;
    }
    closed = true;
    server.close().catch(function (err) {
      console.error("[mcp] close failed", err);
    });
  };

  res.once("close", close);

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("[mcp] request failed", err);
    if (!res.headersSent) {
      return res.status(500).json({
        jsonrpc: "2.0",
        id: req.body && req.body.id != null ? req.body.id : null,
        error: {
          code: -32603,
          message: "Internal error",
        },
      });
    }
  }

  return undefined;
});

export default router;
