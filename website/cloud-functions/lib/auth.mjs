import { createRemoteJWKSet, jwtVerify } from "jose";

let keySet;
let keySetUri;

export function oidcConfiguration(env) {
  const { OIDC_ISSUER, OIDC_AUDIENCE, OIDC_JWKS_URI } = env;
  if (!OIDC_ISSUER || !OIDC_AUDIENCE || !OIDC_JWKS_URI) {
    throw new Error("OIDC_ISSUER, OIDC_AUDIENCE and OIDC_JWKS_URI must be configured");
  }
  const issuer = new URL(OIDC_ISSUER).toString();
  const jwksUri = new URL(OIDC_JWKS_URI);
  if (issuer.startsWith("http://") && env.NODE_ENV === "production") throw new Error("OIDC issuer must use HTTPS");
  if (jwksUri.protocol !== "https:" && env.NODE_ENV === "production") throw new Error("OIDC JWKS endpoint must use HTTPS");
  return { issuer, audience: OIDC_AUDIENCE, jwksUri };
}

export async function verifyAccessToken(authorization, env) {
  if (!authorization?.startsWith("Bearer ")) return null;
  const config = oidcConfiguration(env);
  const uri = config.jwksUri.toString();
  if (!keySet || keySetUri !== uri) {
    keySet = createRemoteJWKSet(config.jwksUri, { timeoutDuration: 5_000, cooldownDuration: 30_000 });
    keySetUri = uri;
  }
  const { payload } = await jwtVerify(authorization.slice(7), keySet, {
    issuer: config.issuer,
    audience: config.audience,
    algorithms: ["RS256", "ES256", "PS256"],
    clockTolerance: 5,
  });
  if (typeof payload.sub !== "string" || payload.sub.length > 255) throw new Error("Invalid subject claim");
  return { issuer: config.issuer, subject: payload.sub };
}
