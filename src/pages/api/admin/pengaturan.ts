import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { setPengaturan } from '../../../lib/db/pengaturan';
import { purgeCache } from '../../../lib/cache/purge';
import { verifyPassword, hashPassword } from '../../../lib/auth/session';

const KONTAK_KEYS = ['kontak_alamat', 'kontak_telepon', 'kontak_email', 'kontak_jam', 'sosial_whatsapp', 'sosial_facebook', 'sosial_instagram', 'situs_logo'];

function zipRows(fd: FormData, prefix: string, numericFields: string[]): Record<string, unknown>[] {
  const labels = fd.getAll(`${prefix}_label`) as string[];
  return labels.map((label, i) => {
    const row: Record<string, unknown> = { label };
    for (const field of numericFields) {
      const raw = (fd.getAll(`${prefix}_${field}`) as string[])[i];
      row[field] = field === 'rw' ? raw : Number(raw) || 0;
    }
    return row;
  });
}

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/pengaturan');

  const fd = await request.formData();
  const form = fd.get('_form') as string;

  if (form === 'kontak') {
    const entries: Record<string, string> = {};
    for (const key of KONTAK_KEYS) entries[key] = ((fd.get(key) as string) ?? '').trim();
    await setPengaturan(entries, env.DB);
    await purgeCache(['/', '/profil', '/pemerintahan', '/kontak', '/wisata', '/umkm', '/berita', '/peta', '/potensi']);
  } else if (form === 'statistik') {
    const stat_umum = JSON.stringify({
      luas: ((fd.get('luas') as string) ?? '').trim(),
      rw: Number(fd.get('rw')) || 0,
      rt: Number(fd.get('rt')) || 0,
    });
    const stat_dusun = JSON.stringify(zipRows(fd, 'dusun', ['rw', 'jmlRw', 'l', 'p', 'kk']));
    const stat_umur = JSON.stringify(zipRows(fd, 'umur', ['value']));
    const stat_pendidikan = JSON.stringify(zipRows(fd, 'pendidikan', ['value']));
    const stat_pencaharian = JSON.stringify(zipRows(fd, 'pencaharian', ['value']));
    await setPengaturan({ stat_umum, stat_dusun, stat_umur, stat_pendidikan, stat_pencaharian }, env.DB);
    await purgeCache(['/', '/profil', '/pemerintahan']);
  } else if (form === 'password') {
    const username = locals.user?.username;
    if (!username) return redirect('/admin/login');

    const currentPassword = (fd.get('current_password') as string) ?? '';
    const newPassword = (fd.get('new_password') as string) ?? '';
    const confirmNewPassword = (fd.get('confirm_new_password') as string) ?? '';

    // 1. Check confirm match
    if (newPassword !== confirmNewPassword) {
      return redirect('/admin/pengaturan?pwd_err=mismatch');
    }

    // 2. Check strength
    const passChecks = {
      length: newPassword.length >= 8,
      upper: /[A-Z]/.test(newPassword),
      lower: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[@$!%*?&#_.\-+=~`'":;?,<>|\(\)\[\]\{\}\\\/^\*]/.test(newPassword)
    };
    const passScore = Object.values(passChecks).filter(Boolean).length;

    if (!passChecks.length || passScore < 3) {
      return redirect('/admin/pengaturan?pwd_err=weak');
    }

    // 3. Verify current password
    const row = await env.DB.prepare('SELECT password_hash FROM admin_user WHERE username = ?')
      .bind(username).first<{ password_hash: string }>();

    if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
      return redirect('/admin/pengaturan?pwd_err=wrong_current');
    }

    // 4. Update password
    const hash = await hashPassword(newPassword);
    await env.DB.prepare('UPDATE admin_user SET password_hash = ? WHERE username = ?')
      .bind(hash, username).run();

    return redirect('/admin/pengaturan?pwd_saved=1');
  } else if (form === 'add_admin') {
    const currentUsername = locals.user?.username;
    if (!currentUsername) return redirect('/admin/login');

    const username = (fd.get('username') as string)?.trim() ?? '';
    const email = (fd.get('email') as string)?.trim().toLowerCase() ?? '';
    const password = (fd.get('password') as string) ?? '';
    const confirmPassword = (fd.get('confirm_password') as string) ?? '';

    // Validate email format
    const adminEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !adminEmailRegex.test(email)) {
      return redirect('/admin/pengaturan?admin_err=email');
    }

    // 1. Check confirm match
    if (password !== confirmPassword) {
      return redirect('/admin/pengaturan?admin_err=mismatch');
    }

    // 2. Check username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return redirect('/admin/pengaturan?admin_err=username');
    }

    // 3. Check password strength
    const passChecks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&#_.\-+=~`'":;?,<>|\(\)\[\]\{\}\\\/^\*]/.test(password)
    };
    const passScore = Object.values(passChecks).filter(Boolean).length;

    if (!passChecks.length || passScore < 3) {
      return redirect('/admin/pengaturan?admin_err=weak');
    }

    // 4. Check admin limit
    const countRow = await env.DB.prepare('SELECT COUNT(*) as cnt FROM admin_user').first<{ cnt: number }>();
    const count = countRow?.cnt ?? 0;
    if (count >= 3) {
      return redirect('/admin/pengaturan?admin_err=limit');
    }

    // 5. Check duplicate username
    const existingUser = await env.DB.prepare('SELECT id FROM admin_user WHERE username = ?')
      .bind(username).first();
    if (existingUser) {
      return redirect('/admin/pengaturan?admin_err=exists');
    }

    // 6. Insert new admin
    const hash = await hashPassword(password);
    await env.DB.prepare('INSERT INTO admin_user (username, password_hash, email) VALUES (?, ?, ?)')
      .bind(username, hash, email).run();

    return redirect('/admin/pengaturan?admin_saved=1');

  } else if (form === 'delete_admin') {
    const currentUsername = locals.user?.username;
    if (!currentUsername) return redirect('/admin/login');

    const adminId = Number(fd.get('admin_id'));
    if (!adminId) return redirect('/admin/pengaturan?admin_err=1');

    // Check if user is trying to delete self
    const targetUser = await env.DB.prepare('SELECT username FROM admin_user WHERE id = ?')
      .bind(adminId).first<{ username: string }>();

    if (!targetUser) {
      return redirect('/admin/pengaturan?admin_err=1');
    }

    if (targetUser.username === currentUsername) {
      return redirect('/admin/pengaturan?admin_err=delete_self');
    }

    // Check if it's the last admin
    const countRow = await env.DB.prepare('SELECT COUNT(*) as cnt FROM admin_user').first<{ cnt: number }>();
    const count = countRow?.cnt ?? 0;
    if (count <= 1) {
      return redirect('/admin/pengaturan?admin_err=delete_last');
    }

    // Delete
    await env.DB.prepare('DELETE FROM admin_user WHERE id = ?').bind(adminId).run();

    return redirect('/admin/pengaturan?admin_deleted=1');
  }

  return redirect('/admin/pengaturan?saved=1');
};
