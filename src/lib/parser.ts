import { detectCategory } from "./categories";

export interface ParsedExpense {
  nama: string;
  jumlah: number;
  kategori: string;
}

/**
 * Parse teks pesan WhatsApp menjadi data transaksi.
 *
 * Format yang didukung:
 *   <nama item> total <angka>
 *
 * Contoh:
 *   "Alat solat total 203.000"       → { nama: "Alat solat", jumlah: 203000, kategori: "Attire" }
 *   "Katering total 15.000.000"      → { nama: "Katering", jumlah: 15000000, kategori: "Catering" }
 *   "Katering total 15.000.000 "     → (trailing whitespace OK)
 *   "halo"                           → null (format salah)
 *
 * Angka mendukung format Indonesia: 203.000, 15.000.000, 500000
 */
export function parseExpenseMessage(text: string): ParsedExpense | null {
  // Regex: nama (non-greedy) + "total" + angka (boleh pakai titik pemisah ribuan)
  const regex = /^\s*(.+?)\s+total\s+([\d.,]+)\s*$/i;
  const match = text.match(regex);

  if (!match) return null;

  const nama = match[1].trim();
  const rawAngka = match[2];

  // Normalisasi: hapus semua non-digit, lalu parse
  const angkaStr = rawAngka.replace(/[^\d]/g, "");
  const jumlah = Number(angkaStr);

  // Guard: jumlah harus > 0 dan merupakan integer valid
  if (!Number.isFinite(jumlah) || jumlah <= 0) return null;

  const kategori = detectCategory(nama);

  return { nama, jumlah, kategori };
}
