export interface LayananItem {
  nama: string;
  deskripsi: string;
  syarat: string[];
  estimasi: string;
  biaya: string;
}

export interface LayananCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: LayananItem[];
}

export const defaultLayananCategories: LayananCategory[] = [
  {
    id: 'kependudukan',
    title: 'Kependudukan & Catatan Sipil',
    description:
      'Pengurusan kartu identitas, kartu keluarga, dan surat keterangan kependudukan lainnya.',
    icon: 'user-check',
    items: [
      {
        nama: 'Surat Pengantar KTP / Kartu Keluarga',
        deskripsi:
          'Surat pengantar untuk menerbitkan atau melakukan perubahan data pada Kartu Tanda Penduduk (KTP) dan Kartu Keluarga (KK) di Dinas Kependudukan dan Catatan Sipil.',
        syarat: [
          'Surat pengantar dari RT/RW setempat',
          'Fotokopi KTP / KK lama (jika ada perubahan/hilang)',
          'Fotokopi Akta Kelahiran / Akta Nikah / Ijazah',
          'Surat Kehilangan dari Kepolisian (jika KTP/KK lama hilang)',
        ],
        estimasi: '1 Hari Kerja',
        biaya: 'Gratis',
      },
      {
        nama: 'Surat Keterangan Domisili',
        deskripsi:
          'Surat keterangan resmi yang menyatakan tempat tinggal atau keberadaan seseorang di wilayah Kelurahan Palabuhanratu.',
        syarat: [
          'Surat pengantar RT/RW setempat',
          'Fotokopi KTP dan Kartu Keluarga pemohon',
          'Surat kuasa bermaterai (jika diwakilkan)',
        ],
        estimasi: '1 Hari Kerja',
        biaya: 'Gratis',
      },
      {
        nama: 'Surat Keterangan Pindah / Datang',
        deskripsi:
          'Surat keterangan untuk warga yang ingin pindah keluar daerah atau melapor kedatangan dari luar wilayah Kelurahan Palabuhanratu.',
        syarat: [
          'Surat pengantar RT/RW setempat',
          'Kartu Keluarga asli dan KTP asli',
          'Surat Keterangan Pindah dari daerah asal (bagi warga baru yang datang)',
          'Pas foto terbaru ukuran 3x4 (2 lembar)',
        ],
        estimasi: '1 - 2 Hari Kerja',
        biaya: 'Gratis',
      },
    ],
  },
  {
    id: 'sosial',
    title: 'Kesejahteraan Sosial & Kesehatan',
    description:
      'Layanan rekomendasi sosial, bantuan pemerintah, dan fasilitas kesehatan masyarakat.',
    icon: 'heart-handshake',
    items: [
      {
        nama: 'Surat Keterangan Tidak Mampu (SKTM)',
        deskripsi:
          'Surat keterangan untuk memperoleh keringanan biaya pendidikan, pengobatan/kesehatan, atau keperluan sosial lainnya bagi keluarga prasejahtera.',
        syarat: [
          'Surat pengantar RT/RW setempat yang menyatakan tidak mampu',
          'Fotokopi Kartu Keluarga dan KTP pemohon',
          'Fotokopi Kartu Indonesia Sehat (KIS)/BPJS (jika ada)',
          'Surat pernyataan tidak mampu bermaterai Rp 10.000 diketahui RT/RW',
        ],
        estimasi: '1 Hari Kerja',
        biaya: 'Gratis',
      },
      {
        nama: 'Rekomendasi Bantuan Sosial',
        deskripsi:
          'Pengajuan atau usulan untuk terdaftar sebagai penerima program bantuan sosial pemerintah (PKH, BPNT, PBI APBD, dll).',
        syarat: [
          'Fotokopi Kartu Keluarga dan KTP',
          'Surat keterangan tidak mampu (SKTM) dari kelurahan',
          'Mengisi formulir DTKS (Data Terpadu Kesejahteraan Sosial)',
        ],
        estimasi: 'Sesuai jadwal verifikasi dinas terkait',
        biaya: 'Gratis',
      },
    ],
  },
  {
    id: 'usaha-tanah',
    title: 'Usaha & Pertanahan',
    description:
      'Surat keterangan usaha mikro, legalitas pengantar, dan administrasi pertanahan kelurahan.',
    icon: 'briefcase',
    items: [
      {
        nama: 'Surat Keterangan Usaha (SKU)',
        deskripsi:
          'Surat keterangan resmi yang menyatakan bahwa pemohon benar memiliki suatu usaha mikro, kecil, atau menengah (UMKM) di wilayah Kelurahan Palabuhanratu.',
        syarat: [
          'Surat pengantar RT/RW setempat',
          'Fotokopi KTP dan Kartu Keluarga pemilik usaha',
          'Foto tempat usaha / aktivitas usaha',
          'Mengisi surat pernyataan kepemilikan usaha',
        ],
        estimasi: '1 Hari Kerja',
        biaya: 'Gratis',
      },
      {
        nama: 'Surat Pengantar Nikah (N1, N2, N4)',
        deskripsi:
          'Surat pengantar kelurahan sebagai syarat wajib pernikahan untuk didaftarkan ke KUA (Kantor Urusan Agama) atau Pencatatan Sipil.',
        syarat: [
          'Surat pengantar RT/RW setempat',
          'Fotokopi KTP dan Kartu Keluarga calon pengantin',
          'Fotokopi Akta Kelahiran dan Ijazah calon pengantin',
          'Fotokopi KTP orang tua / wali',
          'Surat Kematian/Cerai asli (jika berstatus janda/duda)',
          'Pas foto latar belakang biru (2x3 = 4 lembar, 4x6 = 2 lembar)',
        ],
        estimasi: '1 - 2 Hari Kerja',
        biaya: 'Gratis',
      },
      {
        nama: 'Surat Keterangan Riwayat Tanah / Tidak Sengketa',
        deskripsi:
          'Surat keterangan untuk memperkuat pembuktian riwayat kepemilikan tanah dan menyatakan tanah tersebut bebas dari sengketa hukum.',
        syarat: [
          'Surat pengantar RT/RW setempat',
          'Bukti kepemilikan awal (Girik, Pipil, Letter C, atau Akta Jual Beli)',
          'Fotokopi KTP & KK pemohon',
          'Surat pernyataan tidak sengketa yang ditandatangani oleh tetangga batas tanah dan diketahui RT/RW',
        ],
        estimasi: '3 - 5 Hari Kerja (memerlukan peninjauan lapangan)',
        biaya: 'Gratis',
      },
    ],
  },
];
