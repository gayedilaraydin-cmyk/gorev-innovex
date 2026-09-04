import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, checkOwnerPassword, createSessionToken, SESSION_COOKIE_MAX_AGE_SECONDS } from '@/lib/auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!password || !checkOwnerPassword(password)) {
    return NextResponse.json({ error: 'Parola hatalı.' }, { status: 401 });
  }

  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}
