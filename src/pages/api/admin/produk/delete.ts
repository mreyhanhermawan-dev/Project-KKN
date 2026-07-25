import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { deleteProduk } from '../../../../lib/db/produk';
import { purgeCache } from '../../../../lib/cache/purge';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  const fd = await request.formData();
  const id = Number(fd.get('id'));
  const umkm_id = Number(fd.get('umkm_id'));

  if (!id || !env) {
    return redirect('/admin/umkm');
  }

  await deleteProduk(id, env.DB);
  await purgeCache(['/umkm', '/']);
  return redirect(`/admin/umkm/${umkm_id || ''}?produk_deleted=1`);
};
