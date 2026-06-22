import { prisma } from "@/lib/db";
import { TOTAL_BUDGET, WEDDING_DATE } from "@/lib/config";
import CountdownCard from "@/components/dashboard/CountdownCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import BudgetSummary from "@/components/dashboard/BudgetSummary";
import SpendingChart from "@/components/SpendingChart";
import TransactionTable from "@/components/TransactionTable";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalPengeluaran = transactions.reduce(
    (sum: number, tx: typeof transactions[number]) => sum + tx.jumlah,
    0
  );
  const jumlahTransaksi = transactions.length;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-warm-800 sm:text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-warm-400">Ringkasan persiapan pernikahan</p>
        </div>
        {jumlahTransaksi > 0 && (
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white border border-champagne/20 shadow-sm px-4 py-2">
            <span className="text-xs text-warm-400">Total item</span>
            <span className="text-sm font-semibold text-warm-700">{jumlahTransaksi}</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CountdownCard weddingDate={WEDDING_DATE} />
        <ProgressCard percentage={persentaseTerpakai} />
        <BudgetSummary label="Total Budget" value={TOTAL_BUDGET} variant="total" />
        <BudgetSummary
          label="Budget Terpakai"
          value={totalPengeluaran}
          variant="used"
        />
      </div>

      {/* Budget Bar */}
      {totalPengeluaran > 0 && (
        <div className="rounded-xl bg-white border border-champagne/20 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-warm-400">
              Realisasi Anggaran
            </span>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-warm-400">
                Terpakai <strong className="text-warm-700">{((totalPengeluaran / TOTAL_BUDGET) * 100).toFixed(1)}%</strong>
              </span>
              <span className="text-warm-300">|</span>
              <span className="text-warm-400">
                Sisa <strong className={sisaBudget < 0 ? "text-blush-500" : "text-sage-500"}>
                  {((sisaBudget / TOTAL_BUDGET) * 100).toFixed(1)}%
                </strong>
              </span>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-warm-50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-300 via-sage-400 to-sage-500 transition-all duration-500"
              style={{ width: `${Math.min(persentaseTerpakai, 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-warm-300">
            <span>Rp 0</span>
            <span>{formatRupiahCompact(TOTAL_BUDGET)}</span>
          </div>
        </div>
      )}

      {/* Chart + Table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SpendingChart data={chartData} />
        </div>
        <div className="lg:col-span-3">
          {transactions.length > 0 ? (
            <TransactionTable transactions={transactions} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function formatRupiahCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(0)} Juta`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
