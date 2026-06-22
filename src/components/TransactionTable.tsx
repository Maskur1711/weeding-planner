"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah, formatDate } from "@/lib/format";

export interface TransactionRow {
  id: number;
  nama: string;
  jumlah: number;
  kategori: string;
  createdAt: Date;
}

interface TransactionTableProps {
  transactions: TransactionRow[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editJumlah, setEditJumlah] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  function startEdit(tx: TransactionRow) {
    setEditingId(tx.id);
    setEditNama(tx.nama);
    setEditJumlah(String(tx.jumlah));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    const jumlah = Number(editJumlah.replace(/[^\d]/g, ""));
    if (!editNama.trim() || !jumlah || jumlah <= 0) return;

    await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama: editNama.trim(), jumlah }),
    });

    setEditingId(null);
    router.refresh();
  }

  async function deleteTransaction(id: number) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    router.refresh();
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-champagne/20 bg-ivory-50 px-6 py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-champagne-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-champagne-500">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-warm-700">Belum ada transaksi</h3>
        <p className="mt-1 text-xs text-warm-400">
          Kirim pesan ke bot WhatsApp untuk menambahkan
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-champagne/20 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-champagne/20">
        <h2 className="text-sm font-semibold text-warm-700">Daftar Transaksi</h2>
        <span className="text-xs text-warm-400">{transactions.length} item</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-champagne/20">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-warm-400">Nama Item</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-warm-400">Kategori</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-warm-400 text-right">Jumlah</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-warm-400">Tanggal</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-warm-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20">
            {transactions.map((tx) => (
              <tr key={tx.id} className="transition-colors hover:bg-ivory-50/50">
                <td className="px-5 py-3.5 font-medium text-warm-800">
                  {editingId === tx.id ? (
                    <input
                      type="text"
                      value={editNama}
                      onChange={(e) => setEditNama(e.target.value)}
                      className="w-full rounded-lg border border-champagne-300 px-3 py-1.5 text-sm text-warm-800 placeholder-warm-300 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-300"
                      autoFocus
                    />
                  ) : (
                    tx.nama
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-medium text-sage-600">
                    {tx.kategori}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-warm-800">
                  {editingId === tx.id ? (
                    <input
                      type="text"
                      value={editJumlah}
                      onChange={(e) => setEditJumlah(e.target.value)}
                      className="w-full rounded-lg border border-champagne-300 px-3 py-1.5 text-right text-sm text-warm-800 placeholder-warm-300 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-300"
                    />
                  ) : (
                    formatRupiah(tx.jumlah)
                  )}
                </td>
                <td className="px-5 py-3.5 text-sm text-warm-400">
                  {formatDate(new Date(tx.createdAt))}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {confirmDeleteId === tx.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-warm-400">Hapus?</span>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="rounded-lg bg-blush-400 px-3 py-1 text-xs font-medium text-white hover:bg-blush-500 transition-colors"
                      >
                        Ya
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600 hover:bg-warm-200 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  ) : editingId === tx.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => saveEdit(tx.id)}
                        className="rounded-lg bg-sage-400 px-3 py-1 text-xs font-medium text-white hover:bg-sage-500 transition-colors"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600 hover:bg-warm-200 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(tx)}
                        className="rounded-lg bg-champagne-100 px-3 py-1 text-xs font-medium text-gold-600 hover:bg-champagne-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(tx.id)}
                        className="rounded-lg px-3 py-1 text-xs font-medium text-blush-500 hover:bg-blush-50 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
