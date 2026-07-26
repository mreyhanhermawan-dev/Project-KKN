import { getEnv } from '@lib/env';
import type { APIRoute } from 'astro';
import { purgeCache } from '../../../lib/cache/purge';
import {
  getLayananData,
  saveLayananData,
  removeEmptyCategories,
  upsertCategory,
  sanitizeItem,
} from '../../../lib/db/layanan';

export const POST: APIRoute = async ({ request, redirect }) => {
  const env = getEnv();
  if (!env) return redirect('/admin/layanan?error=1');

  const fd = await request.formData();
  const action = String(fd.get('_action') ?? '');
  const back = String(fd.get('back') ?? '/admin/layanan?saved=1');

  try {
    let data = await getLayananData(env.DB);

    if (action === 'delete') {
      const cIdx = Number(fd.get('cat_index'));
      const iIdx = Number(fd.get('item_index'));
      if (!Number.isInteger(cIdx) || !Number.isInteger(iIdx)) throw new Error('invalid index');
      const cat = data[cIdx];
      if (!cat || !cat.items[iIdx]) throw new Error('not found');
      cat.items.splice(iIdx, 1);
      data = removeEmptyCategories(data);
    } else if (action === 'create' || action === 'update') {
      const catId = String(fd.get('cat_id') ?? '').trim();
      const catTitle = String(fd.get('cat_title') ?? '').trim();
      const catDescription = String(fd.get('cat_description') ?? '').trim();
      const catIcon = String(fd.get('cat_icon') ?? 'file-text').trim();

      const nama = String(fd.get('nama') ?? '').trim();
      const deskripsi = String(fd.get('deskripsi') ?? '').trim();
      const syaratRaw = String(fd.get('syarat_raw') ?? '');
      const estimasi = String(fd.get('estimasi') ?? '1 Hari Kerja');
      const biaya = String(fd.get('biaya') ?? 'Gratis');

      if (!catId || !catTitle || !catDescription || !nama || !deskripsi) throw new Error('required');

      const item = sanitizeItem({ nama, deskripsi, syaratRaw, estimasi, biaya });

      if (action === 'update') {
        const cIdx = Number(fd.get('cat_index'));
        const iIdx = Number(fd.get('item_index'));
        if (!Number.isInteger(cIdx) || !Number.isInteger(iIdx)) throw new Error('invalid index');
        const oldCat = data[cIdx];
        if (!oldCat || !oldCat.items[iIdx]) throw new Error('not found');
        oldCat.items.splice(iIdx, 1);
        data = removeEmptyCategories(data);
      }

      const target = upsertCategory(data, {
        id: catId,
        title: catTitle,
        description: catDescription,
        icon: catIcon,
      });
      target.items.push(item);
    } else {
      throw new Error('unsupported action');
    }

    await saveLayananData(data, env.DB);
    await purgeCache(['/layanan', '/']);
    return redirect(back);
  } catch {
    return redirect('/admin/layanan?error=1');
  }
};
