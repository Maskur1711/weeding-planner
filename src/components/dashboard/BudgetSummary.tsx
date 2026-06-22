interface BudgetSummaryProps {
  label: string;
  value: number;
  variant: "total" | "used" | "remaining";
}

const variants = {
  total: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
    bgAccent: "bg-gold-50",
    textAccent: "text-gold-600",
    iconColor: "text-gold-400",
  },
  used: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    bgAccent: "bg-blush-50",
    textAccent: "text-blush-500",
    iconColor: "text-blush-300",
  },
  remaining: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </svg>
    ),
    bgAccent: "bg-sage-50",
    textAccent: "text-sage-500",
    iconColor: "text-sage-300",
  },
};

export default function BudgetSummary({ label, value, variant }: BudgetSummaryProps) {
  const v = variants[variant];

  return (
    <div className="rounded-xl bg-white border border-champagne/20 shadow-sm transition-all hover:border-champagne-300 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-warm-400">
            <span className={v.iconColor}>{v.icon}</span>
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${v.bgAccent} ${v.textAccent}`}>
            {variant === "total" ? "Tetap" : variant === "used" ? "Terpakai" : "Tersisa"}
          </span>
        </div>

        <div className={`mt-4 text-2xl font-light tracking-tight ${variant === "remaining" && value < 0 ? "text-blush-500" : "text-warm-800"}`}>
          {formatRupiah(value)}
        </div>

        {variant === "total" && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-warm-50 overflow-hidden">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-gold-200 to-gold-400 opacity-60" />
          </div>
        )}
      </div>
    </div>
  );
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
