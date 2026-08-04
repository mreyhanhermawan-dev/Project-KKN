import type { APIRoute } from 'astro';
import { getEnv } from '@lib/env';
import { deleteAspirasi, markAspirasiRead, getAllAspirasi } from '../../../lib/db/aspirasi';

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

export const GET: APIRoute = async ({ request }) => {
  const env = getEnv();
  if (!env) return new Response('Database Unavailable', { status: 503 });

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('q') || '';
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';
    const month = url.searchParams.get('month') || '';

    let list = await getAllAspirasi(env.DB);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item => 
        item.nama.toLowerCase().includes(q) || 
        (item.kontak && item.kontak.toLowerCase().includes(q)) ||
        item.isi.toLowerCase().includes(q)
      );
    }

    if (startDate) {
      list = list.filter(item => item.created_at.slice(0, 10) >= startDate);
    }
    if (endDate) {
      list = list.filter(item => item.created_at.slice(0, 10) <= endDate);
    }
    if (month) {
      list = list.filter(item => item.created_at.slice(0, 7) === month);
    }

    const headers = ['ID', 'Nama', 'Kontak', 'Isi Aspirasi', 'Status', 'Tanggal Masuk'];
    const csvRows = [headers.map(escapeCSV).join(',')];

    for (const item of list) {
      const row = [
        item.id,
        item.nama,
        item.kontak ?? '',
        item.isi,
        item.status === 'baru' ? 'Baru' : 'Dibaca',
        item.created_at
      ];
      csvRows.push(row.map(escapeCSV).join(','));
    }

    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const date = new Date().toISOString().slice(0, 10);
    const filename = `aspirasi-warga-${date}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err) {
    console.error(err);
    return new Response('Failed to generate CSV export', { status: 500 });
  }
};

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
