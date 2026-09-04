import crypto from 'node:crypto';
import { cookies } from 'next/headers';

// Tek kullanıcılı (owner) parola girişi — kullanıcı adı/e-posta yok.
// Oturum, sunucu tarafında imzalanan basit bir HMAC token'ı olarak
// HttpOnly bir çerezde tutulur; ayrı bir "sessions" tablosuna gerek yok.

export const COOKIE_NAME = 'gorev_session';
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 gün

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET ortam değişkeni tanımlı değil.');
  return secret;
}

function sign(issuedAt: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(issuedAt).digest('hex');
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) return false;
  if (!timingSafeStringEqual(sign(issuedAt), signature)) return false;
  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age <= MAX_AGE_MS;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(COOKIE_NAME)?.value);
}

export function checkOwnerPassword(password: string): boolean {
  const expected = process.env.OWNER_PASSWORD;
  if (!expected) throw new Error('OWNER_PASSWORD ortam değişkeni tanımlı değil.');
  return timingSafeStringEqual(password, expected);
}

// Claude/otomasyonun kimlik doğrulaması olmadan görev ekleyebilmesi için
// ayrı, opsiyonel bir anahtar. Tanımlı değilse bu yol tamamen kapalıdır.
export function isValidApiKey(authorizationHeader: string | null): boolean {
  const expected = process.env.API_KEY;
  if (!expected || !authorizationHeader) return false;
  const provided = authorizationHeader.replace(/^Bearer\s+/i, '');
  return timingSafeStringEqual(provided, expected);
}

export const SESSION_COOKIE_MAX_AGE_SECONDS = MAX_AGE_MS / 1000;
