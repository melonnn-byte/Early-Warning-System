import { Card } from "@/components/ui/Card";

const actionGuides = [
  {
    id: "aksi-kuning",
    level: "Kuning",
    className: "bg-amber-50 border-amber-200 text-amber-900",
    steps: [
      "Pantau dashboard setiap 10-15 menit untuk melihat tren kenaikan air.",
      "Siapkan dokumen penting, obat, dan tas darurat keluarga.",
      "Pastikan ponsel aktif dan notifikasi sistem tidak dimatikan.",
    ],
  },
  {
    id: "aksi-oren",
    level: "Oren",
    className: "bg-orange-50 border-orange-200 text-orange-900",
    steps: [
      "Pindahkan barang penting ke tempat yang lebih tinggi.",
      "Siapkan anggota keluarga rentan untuk evakuasi lebih awal.",
      "Cek rute evakuasi terdekat dan koordinasi dengan tetangga.",
    ],
  },
  {
    id: "aksi-merah",
    level: "Merah",
    className: "bg-rose-50 border-rose-200 text-rose-900",
    steps: [
      "Lakukan evakuasi segera ke titik aman resmi.",
      "Matikan listrik utama rumah bila kondisi memungkinkan.",
      "Ikuti arahan petugas BPBD/SAR dan hindari melawan arus banjir.",
    ],
  },
];

const faqs = [
  {
    q: "Apa yang harus dilakukan saat status merah?",
    a: "Segera evakuasi ke titik aman, matikan listrik utama, dan ikuti arahan petugas lapangan.",
  },
  {
    q: "Bagaimana membaca status indikator?",
    a: "Hijau = normal, Kuning = waspada, Oren = siaga, Merah = bahaya. Pantau dashboard secara berkala.",
  },
  {
    q: "Apakah notifikasi selalu real-time?",
    a: "Ya, notifikasi dikirim melalui kanal yang dipilih petugas saat terjadi perubahan status penting.",
  },
];

export default function EducationPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Edukasi Banjir & FAQ</h1>
      <p className="mb-6 text-sm text-slate-600">
        Panduan singkat agar warga lebih siap menghadapi potensi banjir.
      </p>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {actionGuides.map((guide) => (
          <Card key={guide.id} className={`border ${guide.className}`}>
            <h2 className="text-base font-semibold">Status {guide.level}</h2>
            <ol className="mt-2 space-y-2 text-sm">
              {guide.steps.map((step, index) => (
                <li key={step}>
                  <span className="font-semibold">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>

      <div className="mb-6 space-y-3">
        {actionGuides.map((guide) => (
          <section id={guide.id} key={`${guide.id}-detail`} className="scroll-mt-24">
            <Card className={`border ${guide.className}`}>
              <h2 className="text-lg font-bold">Panduan Tindakan Status {guide.level}</h2>
              <p className="mt-1 text-sm">Ikuti langkah berikut untuk mengurangi risiko saat notifikasi {guide.level.toLowerCase()} muncul.</p>
              <ul className="mt-3 space-y-2 text-sm">
                {guide.steps.map((step) => (
                  <li key={`${guide.id}-${step}`}>• {step}</li>
                ))}
              </ul>
            </Card>
          </section>
        ))}
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <Card key={item.q}>
            <h2 className="text-base font-semibold text-slate-900">{item.q}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.a}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
