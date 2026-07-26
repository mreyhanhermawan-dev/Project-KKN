import type { APIRoute } from 'astro';
import { getEnv } from '@lib/env';
import { createAspirasi } from '../../lib/db/aspirasi';

const NAMA_MAX = 100;
const KONTAK_MAX = 120;
const ISI_MIN = 10;
const ISI_MAX = 2000;

const RATE_LIMIT_WINDOW_SEC = 15 * 60; // 15 menit
const RATE_LIMIT_MAX_ATTEMPTS = 3;

async function isRateLimited(kv: KVNamespace, key: string): Promise<boolean> {
  const now = Date.now();
  const raw = await kv.get(key);
  let entries: number[] = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) entries = parsed.filter((v) => Number.isFinite(v));
    } catch {}
  }

  const threshold = now - RATE_LIMIT_WINDOW_SEC * 1000;
  entries = entries.filter((ts) => ts >= threshold);

  if (entries.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    await kv.put(key, JSON.stringify(entries), { expirationTtl: RATE_LIMIT_WINDOW_SEC });
    return true;
  }

  entries.push(now);
  await kv.put(key, JSON.stringify(entries), { expirationTtl: RATE_LIMIT_WINDOW_SEC });
  return false;
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) return cfIp;

  const forwarded = request.headers.get('X-Forwarded-For');
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/layanan?aspirasi=error');

  const fd = await request.formData();

  // Honeypot field (harus kosong). Kalau terisi, anggap sukses tapi jangan simpan.
  const website = String(fd.get('website') ?? '').trim();
  if (website) return redirect('/layanan?aspirasi=ok');

  const nama = String(fd.get('nama') ?? '').trim();
  const kontak = String(fd.get('kontak') ?? '').trim();
  const isi = String(fd.get('aspirasi') ?? '').trim();

  if (!nama || !isi) {
    return redirect('/layanan?aspirasi=invalid');
  }

  if (nama.length > NAMA_MAX || kontak.length > KONTAK_MAX || isi.length < ISI_MIN || isi.length > ISI_MAX) {
    return redirect('/layanan?aspirasi=invalid');
  }

  try {
    // Throttle per IP: max 3 kiriman per 15 menit
    const ip = getClientIp(request);
    const key = `aspirasi:rate:${ip}`;
    const limited = await isRateLimited(env.SESSION_KV, key);
    if (limited) {
      return redirect('/layanan?aspirasi=limit');
    }

    await createAspirasi({ nama, kontak, isi }, env.DB);
    return redirect('/layanan?aspirasi=ok');
  } catch {
    return redirect('/layanan?aspirasi=error');
  }
};
