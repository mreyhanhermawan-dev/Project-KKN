import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { upsertSection } from '../../../lib/db/page-section';
import { purgeCache } from '../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/konten');

  const fd = await request.formData();
  const slug = fd.get('slug') as string;
  const title = (fd.get('title') as string)?.trim();
  const content_html = fd.get('content_html') as string;
  const cover_r2_key = fd.get('cover_r2_key') as string | null;
  const cover_alt = fd.get('cover_alt') as string | null;

  if (!slug || !title) return redirect(`/admin/konten/${slug}?error=1`);

  await upsertSection(slug, { title, content_html, cover_r2_key, cover_alt }, env.DB);

  // Purge relevant public cache paths
  const purgePaths = ['/', '/profil', '/potensi', '/pemerintahan'];
  await purgeCache(purgePaths);

  return redirect(`/admin/konten/${slug}?saved=1`);
};
