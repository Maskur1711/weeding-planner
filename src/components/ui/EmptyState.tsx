export default function EmptyState({
  title = "Belum ada data",
  description = "Kirim pesan WhatsApp ke bot untuk memulai pencatatan.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-champagne/20 bg-ivory-50 px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-champagne-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-champagne-500">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-warm-700">{title}</h3>
      <p className="mt-1 text-sm text-warm-400 max-w-xs">{description}</p>
    </div>
  );
}
