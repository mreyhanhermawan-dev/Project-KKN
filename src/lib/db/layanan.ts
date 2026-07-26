import { getSection, upsertSection } from './page-section';
import { defaultLayananCategories, type LayananCategory, type LayananItem } from '../layanan-default';

const LAYANAN_SLUG = 'layanan-data';

function cloneDefault(): LayananCategory[] {
  return JSON.parse(JSON.stringify(defaultLayananCategories));
}

export async function getLayananData(db: D1Database): Promise<LayananCategory[]> {
  const section = await getSection(LAYANAN_SLUG, db);
  if (!section?.content_html) return cloneDefault();

  try {
    const parsed = JSON.parse(section.content_html);
    if (!Array.isArray(parsed)) return cloneDefault();
    const valid = parsed.every((cat) =>
      cat &&
      typeof cat.id === 'string' &&
      typeof cat.title === 'string' &&
      typeof cat.description === 'string' &&
      typeof cat.icon === 'string' &&
      Array.isArray(cat.items)
    );
    return valid ? parsed : cloneDefault();
  } catch {
    return cloneDefault();
  }
}

export async function saveLayananData(data: LayananCategory[], db: D1Database): Promise<void> {
  await upsertSection(LAYANAN_SLUG, {
    title: 'Data Layanan',
    content_html: JSON.stringify(data),
  }, db);
}

export function removeEmptyCategories(data: LayananCategory[]): LayananCategory[] {
  return data.filter((c) => Array.isArray(c.items) && c.items.length > 0);
}

export function upsertCategory(
  data: LayananCategory[],
  catInput: { id: string; title: string; description: string; icon: string }
): LayananCategory {
  let cat = data.find((c) => c.id === catInput.id);
  if (!cat) {
    cat = { ...catInput, items: [] };
    data.push(cat);
  } else {
    cat.title = catInput.title;
    cat.description = catInput.description;
    cat.icon = catInput.icon;
  }
  return cat;
}

export function sanitizeItem(input: {
  nama: string;
  deskripsi: string;
  syaratRaw: string;
  estimasi: string;
  biaya: string;
}): LayananItem {
  return {
    nama: input.nama.trim(),
    deskripsi: input.deskripsi.trim(),
    syarat: input.syaratRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    estimasi: input.estimasi.trim() || '1 Hari Kerja',
    biaya: input.biaya.trim() || 'Gratis',
  };
}
