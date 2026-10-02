import crypto from "node:crypto";
import dns from "node:dns/promises";
import https from "node:https";
import net from "node:net";
import axios from "axios";
import jwt from "jsonwebtoken";
import config from "#lib/config.js";
import prisma from "#lib/prisma.js";

export const MCP_SCOPE = "mcp:read";
export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;

const AUTH_CODE_TTL_MS = 5 * 60 * 1000;
const COMPLETION_TTL_MS = 5 * 60 * 1000;
const GRANT_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const CLIENT_METADATA_TIMEOUT_MS = 5000;
const CLIENT_METADATA_MAX_BYTES = 64 * 1024;

if (config.env === "production" && !config.MCP_OAUTH_SECRET) {
  throw new Error("MCP_OAUTH_SECRET or SECRET is required for MCP OAuth");
}

const tokenSecret = config.MCP_OAUTH_SECRET || "operational-mcp-development-secret";

function toBaseUrl(value = "") {
  return String(value || "")
    .trim()
    .replace(/\/$/, "");
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function generateId(prefix = "") {
  return `${prefix}${base64UrlEncode(crypto.randomBytes(24))}`;
}

function hashSecret(value) {
  return crypto
    .createHash("sha256")
    .update(String(value || ""))
    .digest("hex");
}

function parseStoredValue(record) {
  if (!record || !record.value) {
    return null;
  }

  try {
    return JSON.parse(record.value);
  } catch (err) {
    return null;
  }
}

export function getBaseUrl(req) {
  const configuredBaseUrl = toBaseUrl(config.baseUrl);

  if (config.env === "production") {
    return configuredBaseUrl;
  }

  const forwardedHost = String(req.headers["x-forwarded-host"] || "")
    .split(",")[0]
    .trim();
  const host = forwardedHost || String(req.headers.host || "").trim();
  const forwardedProtocol = String(req.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const protocol = forwardedProtocol || req.protocol || "http";

  if (!host) {
    return configuredBaseUrl;
  }

  return `${protocol}://${host}`;
}

export function getMcpResource(req) {
  return `${getBaseUrl(req)}/mcp`;
}

export function getResourceMetadataUrl(req) {
  return `${getBaseUrl(req)}/.well-known/oauth-protected-resource/mcp`;
}

export function buildAuthorizationServerMetadata(req) {
  const baseUrl = getBaseUrl(req);

  return {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/authorize`,
    token_endpoint: `${baseUrl}/token`,
    revocation_endpoint: `${baseUrl}/revoke`,
    revocation_endpoint_auth_methods_supported: ["none"],
    response_types_supported: ["code"],
    response_modes_supported: ["query", "form_post"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    scopes_supported: [MCP_SCOPE],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    client_id_metadata_document_supported: true,
    authorization_response_iss_parameter_supported: true,
  };
}

export function buildProtectedResourceMetadata(req) {
  return {
    resource: getMcpResource(req),
    authorization_servers: [getBaseUrl(req)],
    scopes_supported: [MCP_SCOPE],
    bearer_methods_supported: ["header"],
  };
}

export function buildServerCard(req) {
  return {
    url: getMcpResource(req),
    authentication: {
      type: "oauth2",
      authorization_server: getBaseUrl(req),
    },
  };
}

function isLoopbackHostname(hostname = "") {
  const value = hostname.replace(/^\[/, "").replace(/\]$/, "");
  return value === "localhost" || value === "127.0.0.1" || value === "::1";
}

function isPublicIpAddress(address) {
  const version = net.isIP(address);

  if (version === 4) {
    const parts = address.split(".").map(Number);
    const first = parts[0];
    const second = parts[1];
    const third = parts[2];

    if (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 0) ||
      (first === 192 && second === 168) ||
      (first === 198 && (second === 18 || second === 19)) ||
      (first === 198 && second === 51 && third === 100) ||
      (first === 203 && second === 0 && third === 113)
    ) {
      return false;
    }

    return true;
  }

  if (version === 6) {
    const value = address.toLowerCase();

    if (
      value === "::" ||
      value === "::1" ||
      value.startsWith("fc") ||
      value.startsWith("fd") ||
      value.startsWith("fe") ||
      value.startsWith("ff") ||
      value.startsWith("2001:db8:")
    ) {
      return false;
    }

    if (value.startsWith("::ffff:")) {
      return isPublicIpAddress(value.slice(7));
    }

    return true;
  }

  return false;
}

function pinnedLookup(address, hostname, options, callback) {
  if (options.all) {
    callback(null, [address]);
    return;
  }

  callback(null, address.address, address.family);
}

async function fetchClientMetadata(clientId) {
  let clientUrl;

  try {
    clientUrl = new URL(clientId);
  } catch (err) {
    throw oauthError("invalid_client", "client_id must be an HTTPS metadata URL");
  }

  if (
    clientUrl.protocol !== "https:" ||
    clientUrl.username ||
    clientUrl.password ||
    clientUrl.hash
  ) {
    throw oauthError("invalid_client", "client_id must be a safe HTTPS metadata URL");
  }

  let addresses;
  try {
    addresses = await dns.lookup(clientUrl.hostname, {
      all: true,
      verbatim: true,
    });
  } catch (err) {
    throw oauthError("invalid_client", "Unable to resolve client metadata host");
  }

  if (!addresses.length) {
    throw oauthError("invalid_client", "Unable to resolve client metadata host");
  }

  for (let i = 0; i < addresses.length; i++) {
    if (!isPublicIpAddress(addresses[i].address)) {
      throw oauthError("invalid_client", "client_id metadata host is not public");
    }
  }

  const selectedAddress = addresses[0];
  const agent = new https.Agent({
    lookup: function (hostname, options, callback) {
      pinnedLookup(selectedAddress, hostname, options, callback);
    },
  });

  let response;
  try {
    response = await axios.get(clientUrl.toString(), {
      timeout: CLIENT_METADATA_TIMEOUT_MS,
      maxRedirects: 0,
      maxContentLength: CLIENT_METADATA_MAX_BYTES,
      responseType: "json",
      httpsAgent: agent,
      proxy: false,
      headers: {
        accept: "application/json",
      },
      validateStatus: function (status) {
        return status === 200;
      },
    });
  } catch (err) {
    throw oauthError("invalid_client", "Unable to load client metadata");
  }

  const metadata = response.data;
  if (
    !metadata ||
    typeof metadata !== "object" ||
    metadata.client_id !== clientId ||
    typeof metadata.client_name !== "string" ||
    !metadata.client_name.trim() ||
    !Array.isArray(metadata.redirect_uris) ||
    !metadata.redirect_uris.length
  ) {
    throw oauthError("invalid_client", "Client metadata is incomplete or does not match client_id");
  }

  return {
    clientId: metadata.client_id,
    clientName: metadata.client_name.trim(),
    redirectUris: metadata.redirect_uris,
  };
}

function redirectUriIsRegistered(redirectUri, registeredUris) {
  let requested;

  try {
    requested = new URL(redirectUri);
  } catch (err) {
    return false;
  }

  if (
    requested.hash ||
    requested.username ||
    requested.password ||
    (requested.protocol !== "https:" &&
      !(requested.protocol === "http:" && isLoopbackHostname(requested.hostname)))
  ) {
    return false;
  }

  for (let i = 0; i < registeredUris.length; i++) {
    if (registeredUris[i] === redirectUri) {
      return true;
    }

    try {
      const registered = new URL(registeredUris[i]);
      if (
        isLoopbackHostname(requested.hostname) &&
        requested.protocol === registered.protocol &&
        requested.hostname === registered.hostname &&
        requested.pathname === registered.pathname &&
        requested.search === registered.search &&
        !registered.hash
      ) {
        return true;
      }
    } catch (err) {}
  }

  return false;
}

function normalizeScope(value) {
  const parts = String(value || MCP_SCOPE)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length !== 1 || parts[0] !== MCP_SCOPE) {
    return "";
  }

  return MCP_SCOPE;
}

function oauthError(code, message) {
  const error = new Error(message);
  error.oauthCode = code;
  return error;
}

export async function validateOauthRequest(source = {}, req) {
  const request = {
    responseType: String(source.response_type || "").trim(),
    clientId: String(source.client_id || "").trim(),
    redirectUri: String(source.redirect_uri || "").trim(),
    state: String(source.state || "").trim(),
    codeChallenge: String(source.code_challenge || "").trim(),
    codeChallengeMethod: String(source.code_challenge_method || "").trim(),
    scope: normalizeScope(source.scope),
    responseMode: String(source.response_mode || "query")
      .trim()
      .toLowerCase(),
    resource: String(source.resource || "").trim(),
  };

  if (request.responseType !== "code") {
    throw oauthError(
      "unsupported_response_type",
      "Only the authorization code response type is supported",
    );
  }

  if (!request.clientId || !request.redirectUri || !request.codeChallenge) {
    throw oauthError("invalid_request", "client_id, redirect_uri, and code_challenge are required");
  }

  if (request.codeChallengeMethod !== "S256") {
    throw oauthError("invalid_request", "code_challenge_method must be S256");
  }

  if (!/^[A-Za-z0-9_-]{43}$/.test(request.codeChallenge)) {
    throw oauthError("invalid_request", "code_challenge must be a valid S256 challenge");
  }

  if (!request.scope) {
    throw oauthError("invalid_scope", "The requested scope is not supported");
  }

  if (request.responseMode !== "query" && request.responseMode !== "form_post") {
    throw oauthError("unsupported_response_mode", "The requested response mode is not supported");
  }

  if (request.resource !== getMcpResource(req)) {
    throw oauthError("invalid_target", "The resource must match the Operational MCP endpoint");
  }

  const client = await fetchClientMetadata(request.clientId);
  if (!redirectUriIsRegistered(request.redirectUri, client.redirectUris)) {
    throw oauthError("invalid_request", "redirect_uri is not registered for this client");
  }

  return {
    ...request,
    clientName: client.clientName,
  };
}

export function buildConsentUrl(request) {
  const url = new URL("/oauth/authorize", config.appUrl);
  const fields = {
    response_type: request.responseType,
    client_id: request.clientId,
    redirect_uri: request.redirectUri,
    state: request.state,
    code_challenge: request.codeChallenge,
    code_challenge_method: request.codeChallengeMethod,
    scope: request.scope,
    response_mode: request.responseMode,
    resource: request.resource,
  };
  const keys = Object.keys(fields);

  for (let i = 0; i < keys.length; i++) {
    if (fields[keys[i]]) {
      url.searchParams.set(keys[i], fields[keys[i]]);
    }
  }

  return url.toString();
}

export async function resolveConsentAccount(sessionUser = {}) {
  const userId = Number(sessionUser.id);
  const workspaceId = Number(sessionUser.primaryWorkspace);

  if (!userId || !workspaceId) {
    return null;
  }

  const member = await prisma.workspaceUser.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      workspace: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  });

  if (
    !member ||
    member.workspace.status === "DEACTIVATED" ||
    member.workspace.status === "DELETED"
  ) {
    return null;
  }

  return {
    userId: member.user.id,
    userEmail: member.user.email,
    workspaceId: member.workspace.id,
    workspaceName: member.workspace.name,
  };
}

export async function oauthAccountHasAccess(workspaceId, userId) {
  const member = await prisma.workspaceUser.findUnique({
    where: {
      userId_workspaceId: {
        userId: Number(userId),
        workspaceId: Number(workspaceId),
      },
    },
    select: {
      id: true,
      workspace: {
        select: {
          status: true,
        },
      },
    },
  });

  return !!(
    member &&
    member.workspace.status !== "DEACTIVATED" &&
    member.workspace.status !== "DELETED"
  );
}

function buildOauthRecord(type, value, ttlMs) {
  const secret = generateId(`mcp_${type}_`);

  return {
    secret,
    data: {
      identifier: `mcp:oauth-${type}:${hashSecret(secret)}`,
      value: JSON.stringify(value),
      expiresAt: new Date(Date.now() + ttlMs),
    },
  };
}

export function buildCodeRecord(value) {
  return buildOauthRecord("code", value, AUTH_CODE_TTL_MS);
}

export function buildCompletionRecord(value) {
  return buildOauthRecord("completion", value, COMPLETION_TTL_MS);
}

export async function consumeOauthRecord(type, secret) {
  const identifier = `mcp:oauth-${type}:${hashSecret(secret)}`;

  return await prisma.$transaction(async function (transaction) {
    const record = await transaction.verification.findFirst({
      where: {
        identifier,
      },
    });

    if (!record || record.expiresAt <= new Date()) {
      if (record) {
        await transaction.verification.deleteMany({
          where: {
            id: record.id,
          },
        });
      }
      return null;
    }

    const deleted = await transaction.verification.deleteMany({
      where: {
        id: record.id,
        identifier,
      },
    });

    if (deleted.count !== 1) {
      return null;
    }

    return parseStoredValue(record);
  });
}

export async function cleanupExpiredOauthRecords() {
  await prisma.verification.deleteMany({
    where: {
      identifier: {
        startsWith: "mcp:oauth-",
      },
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}

export function verifyPkce(codeVerifier, codeChallenge) {
  const verifier = String(codeVerifier || "");
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) {
    return false;
  }

  const digest = crypto.createHash("sha256").update(verifier).digest();
  return base64UrlEncode(digest) === String(codeChallenge || "");
}

export function createGrantData(codeRecord, clientId, resource) {
  const grantId = generateId("grant_");
  const refreshSecret = generateId("mcp_refresh_secret_");

  return {
    refreshToken: `mcp_refresh_${grantId}.${refreshSecret}`,
    grant: {
      grantId,
      clientId,
      userId: Number(codeRecord.userId),
      workspaceId: Number(codeRecord.workspaceId),
      scope: codeRecord.scope,
      resource,
      refreshHash: hashSecret(refreshSecret),
    },
  };
}

export async function saveGrant(grant) {
  return await prisma.verification.create({
    data: {
      identifier: `mcp:oauth-grant:${grant.grantId}`,
      value: JSON.stringify(grant),
      expiresAt: new Date(Date.now() + GRANT_TTL_MS),
    },
  });
}

export function parseRefreshToken(token) {
  const value = String(token || "");
  const prefix = "mcp_refresh_";
  const separator = value.indexOf(".");

  if (!value.startsWith(prefix) || separator === -1) {
    return null;
  }

  return {
    grantId: value.slice(prefix.length, separator),
    secret: value.slice(separator + 1),
  };
}

export async function findGrant(grantId) {
  const record = await prisma.verification.findFirst({
    where: {
      identifier: `mcp:oauth-grant:${grantId}`,
    },
  });
  const value = parseStoredValue(record);

  if (!record || !value || record.expiresAt <= new Date()) {
    return null;
  }

  return {
    record,
    value,
  };
}

export async function revokeGrant(grantId) {
  await prisma.verification.deleteMany({
    where: {
      identifier: `mcp:oauth-grant:${grantId}`,
    },
  });
}

export function refreshSecretMatches(grant, secret) {
  const actual = Buffer.from(hashSecret(secret));
  const expected = Buffer.from(String(grant.refreshHash || ""));

  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export async function rotateRefreshGrant(foundGrant) {
  const refreshSecret = generateId("mcp_refresh_secret_");
  const rotatedGrant = {
    ...foundGrant.value,
    refreshHash: hashSecret(refreshSecret),
  };
  const updated = await prisma.verification.updateMany({
    where: {
      id: foundGrant.record.id,
      value: foundGrant.record.value,
    },
    data: {
      value: JSON.stringify(rotatedGrant),
    },
  });

  if (updated.count !== 1) {
    return null;
  }

  return {
    grant: rotatedGrant,
    refreshToken: `mcp_refresh_${rotatedGrant.grantId}.${refreshSecret}`,
  };
}

export function buildAccessToken(req, grant) {
  return jwt.sign(
    {
      userId: grant.userId,
      workspaceId: grant.workspaceId,
      scope: grant.scope,
      clientId: grant.clientId,
      grantId: grant.grantId,
    },
    tokenSecret,
    {
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      issuer: getBaseUrl(req),
      audience: getMcpResource(req),
      subject: String(grant.userId),
      jwtid: generateId("mcp_jwt_"),
      algorithm: "HS256",
    },
  );
}

export function verifyAccessToken(req, token) {
  return jwt.verify(token, tokenSecret, {
    issuer: getBaseUrl(req),
    audience: getMcpResource(req),
    algorithms: ["HS256"],
  });
}

export async function resolveOauthAccess(req, payload) {
  const userId = Number(payload.userId);
  const workspaceId = Number(payload.workspaceId);
  const grantId = String(payload.grantId || "").trim();
  const clientId = String(payload.clientId || "").trim();
  const scope = normalizeScope(payload.scope);

  if (!userId || !workspaceId || !grantId || !clientId || !scope) {
    return null;
  }

  const foundGrant = await findGrant(grantId);
  if (
    !foundGrant ||
    foundGrant.value.userId !== userId ||
    foundGrant.value.workspaceId !== workspaceId ||
    foundGrant.value.clientId !== clientId ||
    foundGrant.value.scope !== scope ||
    foundGrant.value.resource !== getMcpResource(req)
  ) {
    return null;
  }

  if (!(await oauthAccountHasAccess(workspaceId, userId))) {
    await revokeGrant(grantId);
    return null;
  }

  return {
    userId,
    workspaceId,
    grantId,
    clientId,
    scope,
  };
}

export function buildBearerChallenge(req, error) {
  const fields = [
    'Bearer realm="operational-mcp"',
    `resource_metadata="${getResourceMetadataUrl(req)}"`,
    `scope="${MCP_SCOPE}"`,
  ];

  if (error) {
    fields.push(`error="${error}"`);
  }

  return fields.join(", ");
}

export function buildRedirectUrl(redirectUri, fields = {}) {
  const redirect = new URL(redirectUri);
  const keys = Object.keys(fields);

  for (let i = 0; i < keys.length; i++) {
    if (fields[keys[i]] != null && fields[keys[i]] !== "") {
      redirect.searchParams.set(keys[i], String(fields[keys[i]]));
    }
  }

  return redirect.toString();
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildFormPostHtml(redirectUri, fields = {}) {
  const inputs = [];
  const keys = Object.keys(fields);

  for (let i = 0; i < keys.length; i++) {
    inputs.push(
      `<input type="hidden" name="${escapeHtml(keys[i])}" value="${escapeHtml(fields[keys[i]])}" />`,
    );
  }

  return `<!doctype html><html><head><meta charset="utf-8"><title>Redirecting</title></head><body><form id="oauth-form" method="post" action="${escapeHtml(redirectUri)}">${inputs.join("")}</form><script>document.getElementById('oauth-form').submit();</script></body></html>`;
}

export function sendOauthError(res, err) {
  if (err && err.oauthCode) {
    return res.status(400).json({
      error: err.oauthCode,
      error_description: err.message,
    });
  }

  console.error("[mcp] OAuth request failed", err);
  return res.status(500).json({
    error: "server_error",
    error_description: "We couldn't complete this connection. Please try again.",
  });
}
