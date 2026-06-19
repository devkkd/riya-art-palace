import { SignJWT, jwtVerify } from "jose";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be defined and at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(getSecretKey());
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload;
}

export function getJwtSecretKey() {
  return getSecretKey();
}
