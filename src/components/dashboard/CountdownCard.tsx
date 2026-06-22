import { getDaysUntil } from "@/lib/config";

export default function CountdownCard({ weddingDate }: { weddingDate: Date }) {
  const days = getDaysUntil(weddingDate);
  const month = weddingDate.toLocaleDateString("id-ID", { month: "long" });
  const day = weddingDate.getDate();
  const year = weddingDate.getFullYear();

  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-champagne/20 shadow-sm transition-all hover:border-champagne-300 hover:shadow-md">
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-gradient-to-br from-gold-100/60 to-champagne-200/40 blur-2xl" />
      <div className="relative p-5">
        <div className="flex items-center gap-2 text-warm-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-xs font-medium uppercase tracking-wider">Countdown</span>
        </div>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-light tracking-tight text-warm-800">
            {days}
          </span>
          <span className="text-sm font-medium text-warm-400">hari lagi</span>
        </div>

        <div className="mt-2 text-xs text-warm-300">
          {day} {month} {year}
        </div>

        {days <= 30 && days > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blush-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blush-400 animate-pulse" />
            <span className="text-xs font-medium text-blush-500">Semakin dekat!</span>
          </div>
        )}

        {days === 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            <span className="text-xs font-medium text-gold-600">Hari ini!</span>
          </div>
        )}
      </div>
    </div>
  );
}
