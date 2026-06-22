import { prisma } from "@/lib/db";
import TransactionTable from "@/components/TransactionTable";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-warm-800 sm:text-2xl">Transaksi</h1>
        <p className="mt-1 text-sm text-warm-400">Semua catatan pengeluaran pernikahan</p>
      </div>

      {transactions.length > 0 ? (
        <TransactionTable transactions={transactions} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
