import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { detectCategory } from "@/lib/categories";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** GET /api/transactions/:id — ambil satu transaksi */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(id) },
  });

  if (!transaction) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(transaction);
}

/** PATCH /api/transactions/:id — edit nama/jumlah (kategori re-detect) */
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { nama, jumlah } = body;

    // Ambil data lama
    const existing = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    }

    // Kalau nama berubah, re-detect kategori
    const newNama = nama ?? existing.nama;
    const newKategori =
      nama && nama !== existing.nama ? detectCategory(nama) : existing.kategori;

    const updated = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        ...(nama ? { nama: String(nama) } : {}),
        ...(jumlah ? { jumlah: Number(jumlah) } : {}),
        kategori: newKategori,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengupdate" }, { status: 500 });
  }
}

/** DELETE /api/transactions/:id — hapus transaksi */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}
