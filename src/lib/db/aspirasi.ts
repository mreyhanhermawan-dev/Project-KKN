export interface Aspirasi {
  id: number;
  nama: string;
  kontak: string | null;
  isi: string;
  status: 'baru' | 'dibaca';
  created_at: string;
  updated_at: string;
}

let aspirasiTableReady = false;

async function ensureAspirasiTable(db: D1Database): Promise<void> {
  if (aspirasiTableReady) return;

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS aspirasi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      kontak TEXT,
      isi TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'baru',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`
  ).run();

  await db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_aspirasi_status_created
     ON aspirasi(status, created_at DESC)`
  ).run();

  aspirasiTableReady = true;
}

export async function createAspirasi(
  data: { nama: string; kontak?: string | null; isi: string },
  db: D1Database
): Promise<void> {
  await ensureAspirasiTable(db);
  await db
    .prepare(
      `INSERT INTO aspirasi (nama, kontak, isi, status)
       VALUES (?, ?, ?, 'baru')`
    )
    .bind(data.nama.trim(), (data.kontak ?? '').trim() || null, data.isi.trim())
    .run();
}

export async function getAllAspirasi(db: D1Database): Promise<Aspirasi[]> {
  await ensureAspirasiTable(db);
  const r = await db
    .prepare(`SELECT * FROM aspirasi ORDER BY created_at DESC`)
    .all<Aspirasi>();
  return r.results;
}

export async function markAspirasiRead(id: number, db: D1Database): Promise<void> {
  await ensureAspirasiTable(db);
  await db
    .prepare(`UPDATE aspirasi SET status='dibaca', updated_at=datetime('now') WHERE id=?`)
    .bind(id)
    .run();
}

export async function deleteAspirasi(id: number, db: D1Database): Promise<void> {
  await ensureAspirasiTable(db);
  await db.prepare(`DELETE FROM aspirasi WHERE id=?`).bind(id).run();
}
