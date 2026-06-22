export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-warm-800 sm:text-2xl">Pengaturan</h1>
        <p className="mt-1 text-sm text-warm-400">Konfigurasi aplikasi</p>
      </div>

      <div className="rounded-xl bg-white border border-champagne/20 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-warm-700">Format Input WhatsApp</h2>
          <p className="mt-1 text-xs text-warm-400">
            Kirim pesan ke bot dengan format: <code className="rounded bg-champagne-100 px-1.5 py-0.5 text-xs text-warm-600">&lt;nama item&gt; total &lt;angka&gt;</code>
          </p>
          <div className="mt-3 rounded-lg bg-ivory-50 p-4 text-xs text-warm-400 space-y-1">
            <p className="font-medium text-warm-600">Contoh:</p>
            <p><code className="text-warm-700">Alat solat total 203.000</code> → Kategori: Attire</p>
            <p><code className="text-warm-700">Katering total 15.000.000</code> → Kategori: Catering</p>
          </div>
        </div>
      </div>
    </div>
  );
}
