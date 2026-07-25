import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { createProduk } from '../../../../lib/db/produk';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  const fd = await request.formData();
  const umkm_id = Number(fd.get('umkm_id'));
  const nama = (fd.get('nama') as string)?.trim();
  const harga = Number(fd.get('harga')) || 0;
  const deskripsi_html = (fd.get('deskripsi_html') as string) ?? '';
  const status = ((fd.get('status') as string) ?? 'published') as 'draft' | 'published';

  if (!umkm_id || !nama || !env) {
    return redirect(`/admin/umkm/${umkm_id}?error=1`);
  }

  const { slug } = await createProduk({ umkm_id, nama, harga, deskripsi_html, status }, env.DB);
  await purgeCache(['/umkm', `/umkm/${umkm_id}`, `/produk/${slug}`, '/']);
  return redirect(`/admin/umkm/${umkm_id}?produk_saved=1`);
};
