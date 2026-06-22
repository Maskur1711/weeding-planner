import { prisma } from "@/lib/db";
import { TOTAL_BUDGET, WEDDING_DATE } from "@/lib/config";
import BudgetSummary from "@/components/dashboard/BudgetSummary";
import SpendingChart from "@/components/SpendingChart";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalPengeluaran = transactions.reduce(
    (sum: number, tx: typeof transactions[number]) => sum + tx.jumlah,
    0
  );
  const sisaBudget = TOTAL_BUDGET - totalPengeluaran;
  const persentaseTerpakai = (totalPengeluaran / TOTAL_BUDGET) * 100;

  const categoryMap = new Map<string, number>();
  for (const tx of transactions) {
    categoryMap.set(tx.kategori, (categoryMap.get(tx.kategori) || 0) + tx.jumlah);
  }
  const chartData = Array.from(categoryMap.entries())
    .map(([kategori, total]) => ({ kategori, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-warm-800 sm:text-2xl">Anggaran</h1>
        <p className="mt-1 text-sm text-warm-400">Ringkasan anggaran pernikahan</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BudgetSummary label="Total Budget" value={TOTAL_BUDGET} variant="total" />
        <BudgetSummary label="Budget Terpakai" value={totalPengeluaran} variant="used" />
        <BudgetSummary label="Sisa Budget" value={sisaBudget} variant="remaining" />
      </div>

      {totalPengeluaran > 0 && (
        <div className="rounded-xl bg-white border border-champagne/20 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-warm-400">Progress Anggaran</span>
            <span className="text-sm font-medium text-warm-700">{persentaseTerpakai.toFixed(1)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-warm-50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-300 via-sage-400 to-sage-500 transition-all"
              style={{ width: `${Math.min(persentaseTerpakai, 100)}%` }}
            />
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="max-w-md">
          <SpendingChart data={chartData} />
        </div>
      )}
    </div>
  );
}
