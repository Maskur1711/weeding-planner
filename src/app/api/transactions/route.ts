import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** GET /api/transactions — ambil semua transaksi */
export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(transactions);
}

/** POST /api/transactions — buat transaksi baru */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, jumlah, kategori } = body;

    if (!nama || !jumlah || jumlah <= 0) {
      return NextResponse.json(
        { error: "nama dan jumlah (positif) wajib diisi" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        nama: String(nama),
        jumlah: Number(jumlah),
        kategori: kategori || "Lainnya",
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan" }, { status: 500 });
  }
}
