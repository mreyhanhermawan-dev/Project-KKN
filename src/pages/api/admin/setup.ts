import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { hashPassword, createSession, generateSessionId, SESSION_COOKIE, SESSION_TTL } from '../../../lib/auth/session';

export const POST: APIRoute = async ({ request, locals, redirect, cookies }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/login');

  // Only allow when no admin user exists
  const existing = await env.DB.prepare('SELECT id FROM admin_user LIMIT 1').first();
  if (existing) return redirect('/admin/login');

  const formData = await request.formData();
  const username = (formData.get('username') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!username || !usernameRegex.test(username)) {
    return redirect('/admin/setup?error=Nama+pengguna+tidak+valid.+Gunakan+3-20+karakter+berupa+huruf%2C+angka%2C+strip%2C+atau+garis+bawah.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return redirect('/admin/setup?error=Format+email+tidak+valid.');
  }

  if (password !== confirmPassword) {
    return redirect('/admin/setup?error=Konfirmasi+kata+sandi+tidak+cocok.');
  }

  const passChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&#_.\-+=~`'":;?,<>|\(\)\[\]\{\}\\\/^\*]/.test(password)
  };
  const passScore = Object.values(passChecks).filter(Boolean).length;

  if (!passChecks.length || passScore < 3) {
    return redirect('/admin/setup?error=Kata+sandi+terlalu+lemah.+Harus+minimal+8+karakter+dan+memenuhi+3+kriteria+keamanan.');
  }

  const hash = await hashPassword(password);
  await env.DB.prepare('INSERT INTO admin_user (username, password_hash, email) VALUES (?, ?, ?)')
    .bind(username, hash, email).run();

  const sessionId = generateSessionId();
  await createSession(sessionId, username, env.SESSION_KV);
  cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SESSION_TTL,
  });

  return redirect('/admin/dasbor');
};
