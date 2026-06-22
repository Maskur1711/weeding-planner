/**
 * Map keyword → kategori.
 * Parser mengecek apakah nama item mengandung salah satu keyword.
 * Urutan penting: yang paling spesifik dulu, lalu fallback ke Lainnya.
 */

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Catering: [
    "katering",
    "catering",
    "snack",
    "nasi box",
    "makanan",
    "prasmanan",
    "minuman",
    "wedding cake",
    "kue",
    "tart",
    "dessert",
    "puding",
    "es krim",
    "coffee",
    "barista",
  ],
  Attire: [
    "gaun",
    "jas",
    "baju",
    "dress",
    "alat solat",
    "makeup",
    "rias",
    "sepatu",
    "sanggul",
    "aksesoris",
    "cincin",
    "kalung",
    "gelang",
    "mahkota",
    "veil",
    "selendang",
    "kebaya",
    "batik",
    "tuxedo",
    "suit",
    "boutonniere",
    "mua",
  ],
  Venue: [
    "gedung",
    "venue",
    "ballroom",
    "lapangan",
    "sewa tempat",
    "taman",
    "garden",
    "pantai",
    "beach",
    "hotel",
    "resort",
    "resto",
    "restoran",
    "masjid",
    "gereja",
    "pendopo",
    "rumah",
  ],
  Decor: [
    "dekorasi",
    "dekor",
    "bunga",
    "photo booth",
    "photobooth",
    "backdrop",
    "lighting",
    "lampu",
    "stage",
    "pelaminan",
    "gen set",
    "genset",
    "listrik",
    "sound system",
    "sound",
  ],
  "Photo & Video": [
    "foto",
    "video",
    "cinematic",
    "videografer",
    "fotografer",
    "drone",
    "prewedding",
    "prewed",
    "studio",
    "live streaming",
    "livestream",
  ],
  Invitation: [
    "undangan",
    "invitation",
    "digital",
    "cetak",
    "souvenir undangan",
    "amplop",
  ],
  Transport: [
    "mobil",
    "kendaraan",
    "bus",
    "rental",
    "sewa mobil",
    "driver",
    "supir",
    "henna",
  ],
  Entertainment: [
    "band",
    "musik",
    "dj",
    "mc",
    "host",
    "entertainer",
    "tarian",
    "joget",
    "game",
    "doorprize",
  ],
  "WO & Vendor": [
    "wedding organizer",
    "wo",
    "planner",
    "coordinator",
    "event organizer",
  ],
  Souvenir: [
    "souvenir",
    "oleh-oleh",
    "gift",
    "parcel",
    "hamper",
  ],
};

/**
 * Deteksi kategori dari nama item berdasarkan keyword.
 * Match bersifat case-insensitive dan partial (contains).
 */
export function detectCategory(namaItem: string): string {
  const lower = namaItem.toLowerCase();

  for (const [kategori, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return kategori;
      }
    }
  }

  return "Lainnya";
}

/** Semua nama kategori yang tersedia (untuk grafik & filter) */
export const ALL_CATEGORIES = Object.keys(CATEGORY_KEYWORDS).concat(["Lainnya"]);
