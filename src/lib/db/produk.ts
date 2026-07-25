import { toSlug } from './wisata';

export interface Produk {
  id: number;
  umkm_id: number;
  slug: string;
  nama: string;
  harga: number;
  deskripsi_html: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ProdukWithStore extends Produk {
  umkm_nama: string;
  umkm_slug: string;
  umkm_kategori: string;
  umkm_lokasi: string | null;
  umkm_wa_number: string | null;
  umkm_telepon: string | null;
  umkm_google_maps_url: string | null;
  umkm_toko_online_url: string | null;
  umkm_qris_r2_key: string | null;
}

export function formatRupiah(harga: number): string {
  if (!harga || isNaN(harga)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(harga);
}

export async function getPublishedProduk(db: D1Database): Promise<ProdukWithStore[]> {
  const r = await db.prepare(
    `SELECT p.*,
            u.nama AS umkm_nama,
            u.slug AS umkm_slug,
            u.kategori AS umkm_kategori,
            u.lokasi AS umkm_lokasi,
            u.wa_number AS umkm_wa_number,
            u.telepon AS umkm_telepon,
            u.google_maps_url AS umkm_google_maps_url,
            u.toko_online_url AS umkm_toko_online_url,
            u.qris_r2_key AS umkm_qris_r2_key
     FROM produk p
     JOIN umkm u ON u.id = p.umkm_id
     WHERE p.status='published' AND u.status='published'
     ORDER BY p.nama ASC`
  ).all<ProdukWithStore>();
  return r.results;
}

export async function getProdukBySlug(slug: string, db: D1Database): Promise<ProdukWithStore | null> {
  return db.prepare(
    `SELECT p.*,
            u.nama AS umkm_nama,
            u.slug AS umkm_slug,
            u.kategori AS umkm_kategori,
            u.lokasi AS umkm_lokasi,
            u.wa_number AS umkm_wa_number,
            u.telepon AS umkm_telepon,
            u.google_maps_url AS umkm_google_maps_url,
            u.toko_online_url AS umkm_toko_online_url,
            u.qris_r2_key AS umkm_qris_r2_key
     FROM produk p
     JOIN umkm u ON u.id = p.umkm_id
     WHERE p.slug=? AND p.status='published' AND u.status='published'`
  ).bind(slug).first<ProdukWithStore>();
}

export async function getProdukByUmkmId(umkmId: number, db: D1Database): Promise<Produk[]> {
  const r = await db.prepare(
    `SELECT * FROM produk WHERE umkm_id=? AND status='published' ORDER BY nama ASC`
  ).bind(umkmId).all<Produk>();
  return r.results;
}

/**
 * Fetch all OTHER products owned by the same store (umkm_id), excluding current product ID.
 */
export async function getOtherProdukFromSameStore(
  umkmId: number,
  currentProductId: number,
  db: D1Database
): Promise<Produk[]> {
  const r = await db.prepare(
    `SELECT * FROM produk WHERE umkm_id=? AND id != ? AND status='published' ORDER BY nama ASC`
  ).bind(umkmId, currentProductId).all<Produk>();
  return r.results;
}

export async function getAllProduk(db: D1Database): Promise<ProdukWithStore[]> {
  const r = await db.prepare(
    `SELECT p.*, u.nama AS umkm_nama, u.slug AS umkm_slug
     FROM produk p
     JOIN umkm u ON u.id = p.umkm_id
     ORDER BY p.updated_at DESC`
  ).all<ProdukWithStore>();
  return r.results;
}

export async function getProdukById(id: number, db: D1Database): Promise<ProdukWithStore | null> {
  return db.prepare(
    `SELECT p.*, u.nama AS umkm_nama, u.slug AS umkm_slug
     FROM produk p
     JOIN umkm u ON u.id = p.umkm_id
     WHERE p.id=?`
  ).bind(id).first<ProdukWithStore>();
}

export async function createProduk(
  data: {
    umkm_id: number;
    nama: string;
    harga: number;
    deskripsi_html: string;
    status: 'draft' | 'published';
  },
  db: D1Database
): Promise<{ id: number; slug: string }> {
  const baseSlug = toSlug(data.nama);
  let slug = baseSlug;
  let i = 1;
  while (await db.prepare('SELECT id FROM produk WHERE slug=?').bind(slug).first()) {
    slug = `${baseSlug}-${i++}`;
  }
  const r = await db.prepare(
    `INSERT INTO produk (umkm_id, slug, nama, harga, deskripsi_html, status)
     VALUES (?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(data.umkm_id, slug, data.nama, data.harga, data.deskripsi_html, data.status)
   .first<{ id: number }>();
  return { id: r!.id, slug };
}

export async function updateProduk(
  id: number,
  data: {
    umkm_id: number;
    nama: string;
    harga: number;
    deskripsi_html: string;
    status: 'draft' | 'published';
  },
  db: D1Database
): Promise<void> {
  await db.prepare(
    `UPDATE produk SET umkm_id=?, nama=?, harga=?, deskripsi_html=?, status=?, updated_at=datetime('now')
     WHERE id=?`
  ).bind(data.umkm_id, data.nama, data.harga, data.deskripsi_html, data.status, id).run();
}

export async function deleteProduk(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM media_link WHERE owner_type=? AND owner_id=?').bind('produk', id).run();
  await db.prepare('DELETE FROM produk WHERE id=?').bind(id).run();
}
