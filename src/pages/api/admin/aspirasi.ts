import type { APIRoute } from 'astro';
import { getEnv } from '@lib/env';
import { deleteAspirasi, markAspirasiRead } from '../../../lib/db/aspirasi';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/aspirasi?error=1');

  const fd = await request.formData();
  const action = String(fd.get('_action') ?? '');
  const id = Number(fd.get('id') ?? 0);

  if (!id) return redirect('/admin/aspirasi?error=1');

  try {
    if (action === 'read') {
      await markAspirasiRead(id, env.DB);
    } else if (action === 'delete') {
      await deleteAspirasi(id, env.DB);
    } else {
      return redirect('/admin/aspirasi?error=1');
    }

    return redirect('/admin/aspirasi?saved=1');
  } catch {
    return redirect('/admin/aspirasi?error=1');
  }
};
