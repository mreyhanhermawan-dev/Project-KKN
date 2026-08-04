import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { updateTitikPeta, getTitikPetaById } from '../../../../lib/db/titik-peta';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const env = getEnv();
  const id = Number(params.id);
  const fd = await request.formData();
  const lat = parseFloat(fd.get('lat') as string);
  const lng = parseFloat(fd.get('lng') as string);
  const jenis = fd.get('jenis') as 'wisata' | 'umkm' | 'potensi' | 'pemerintahan';
  const linked_slug = (fd.get('linked_slug') as string)?.trim();
  const label = (fd.get('label') as string)?.trim() || null;
  const desc = (fd.get('desc') as string)?.trim() || null;

  if (!env || isNaN(lat) || isNaN(lng) || !jenis || !linked_slug) {
    return redirect(`/admin/peta/${id}?error=1`);
  }

  const existing = await getTitikPetaById(id, env.DB);
  if (!existing) {
    return redirect('/admin/peta');
  }

  await updateTitikPeta(id, { lat, lng, jenis, linked_slug, label, desc }, env.DB);
  await purgeCache(['/peta', '/profil', '/kontak', '/']);
  return redirect(`/admin/peta/${id}?saved=1`);
};
