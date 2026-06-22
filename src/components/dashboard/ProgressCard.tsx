export default function ProgressCard({
  percentage,
  label = "Progress Persiapan",
}: {
  percentage: number;
  label?: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="rounded-xl bg-white border border-champagne/20 shadow-sm transition-all hover:border-champagne-300 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center gap-2 text-warm-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12a10 10 0 11-20 0 10 10 0 0120 0z" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          {/* Circular progress */}
          <div className="relative flex-shrink-0">
            <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
              <circle
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                stroke="#F0ECE6"
                strokeWidth="5"
              />
              <circle
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C8DAB0" />
                  <stop offset="100%" stopColor="#8DAF6A" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-warm-700">
                {Math.min(Math.round(percentage), 100)}%
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-2xl font-light tracking-tight text-warm-800">
              {Math.min(Math.round(percentage), 100)}%
            </div>
            <div className="mt-1 text-xs text-warm-300">
              {percentage >= 100
                ? "Anggaran penuh terpakai"
                : `${formatRupiah(percentage)} dari anggaran`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
