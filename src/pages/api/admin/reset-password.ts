import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { hashPassword } from '../../../lib/auth/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/reset-password?error=1');

  const formData = await request.formData();
  const token = (formData.get('token') as string)?.trim();
  const newPassword = (formData.get('new_password') as string) ?? '';
  const confirmPassword = (formData.get('confirm_password') as string) ?? '';

  if (!token) {
    return redirect('/admin/lupa-password?error=expired');
  }

  // 1. Verify token from KV
  const username = await env.SESSION_KV.get(`pwd_reset:${token}`);
  if (!username) {
    return redirect('/admin/reset-password?token=' + encodeURIComponent(token) + '&error=expired');
  }

  // 2. Check confirm match
  if (newPassword !== confirmPassword) {
    return redirect('/admin/reset-password?token=' + encodeURIComponent(token) + '&error=mismatch');
  }

  // 3. Check password strength
  const passChecks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&#_.\-+=~`'":;?,<>|\(\)\[\]\{\}\\\/^\*]/.test(newPassword)
  };
  const passScore = Object.values(passChecks).filter(Boolean).length;

  if (!passChecks.length || passScore < 3) {
    return redirect('/admin/reset-password?token=' + encodeURIComponent(token) + '&error=weak');
  }

  // 4. Update password in DB
  const hash = await hashPassword(newPassword);
  await env.DB.prepare('UPDATE admin_user SET password_hash = ? WHERE username = ?')
    .bind(hash, username).run();

  // 5. Delete the token from KV so it can't be reused
  await env.SESSION_KV.delete(`pwd_reset:${token}`);

  // Redirect to login with success message
  return redirect('/admin/login?error=' + encodeURIComponent('Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru Anda.'));
};
