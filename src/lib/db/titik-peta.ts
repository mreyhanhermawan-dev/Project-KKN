export interface TitikPeta {
  id: number;
  lat: number;
  lng: number;
  jenis: 'wisata' | 'umkm' | 'potensi' | 'pemerintahan';
  linked_slug: string;
  label: string | null;
  desc: string | null;
}

export async function getAllTitikPeta(db: D1Database): Promise<TitikPeta[]> {
  const r = await db.prepare('SELECT * FROM titik_peta ORDER BY id').all<TitikPeta>();
  return r.results;
}

export async function getTitikPetaById(id: number, db: D1Database): Promise<TitikPeta | null> {
  return db.prepare('SELECT * FROM titik_peta WHERE id = ?').bind(id).first<TitikPeta>();
}

export async function createTitikPeta(
  data: Omit<TitikPeta, 'id'>,
  db: D1Database
): Promise<number> {
  const r = await db.prepare(
    'INSERT INTO titik_peta (lat, lng, jenis, linked_slug, label, desc) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'
  ).bind(data.lat, data.lng, data.jenis, data.linked_slug, data.label, data.desc).first<{ id: number }>();
  return r!.id;
}

export async function updateTitikPeta(
  id: number,
  data: Omit<TitikPeta, 'id'>,
  db: D1Database
): Promise<void> {
  await db.prepare(
    'UPDATE titik_peta SET lat=?, lng=?, jenis=?, linked_slug=?, label=?, desc=? WHERE id=?'
  ).bind(data.lat, data.lng, data.jenis, data.linked_slug, data.label, data.desc, id).run();
}

export async function deleteTitikPeta(id: number, db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM titik_peta WHERE id=?').bind(id).run();
}
