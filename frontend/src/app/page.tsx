import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { PublicRealtimeDashboardSection } from "@/components/landing/PublicRealtimeDashboardSection";
import { emergencyContacts } from "@/constants";
import { AuthRedirectWrapper } from "@/components/AuthRedirectWrapper";

const statusLegend = [
  {
    color: "bg-emerald-500",
    title: "Hijau (Normal)",
    description: "Kondisi aman, ketinggian air di bawah ambang batas waspada.",
    threshold: "< 150 cm",
    action: "Aktivitas normal, tetap pantau dashboard setiap 30 menit.",
    icon: "✅",
  },
  {
    color: "bg-amber-500",
    title: "Kuning (Waspada)",
    description: "Ketinggian air meningkat, masyarakat diminta waspada dan bersiap.",
    threshold: "150 – 199 cm",
    action: "Siapkan tas darurat, dokumen penting, dan rute evakuasi keluarga.",
    icon: "⚠️",
  },
  {
    color: "bg-rose-500",
    title: "Merah (Bahaya / Evakuasi)",
    description: "Kondisi darurat, evakuasi segera diperlukan sesuai arahan petugas.",
    threshold: "≥ 200 cm",
    action: "Segera evakuasi ke titik aman terdekat dan ikuti arahan petugas.",
    icon: "🚨",
  },
];

const emergencyMeta: Record<string, { scope: string; response: string; note: string }> = {
  "BPBD Kota": {
    scope: "Koordinasi kebencanaan wilayah",
    response: "Target respons 5-10 menit",
    note: "Gunakan untuk laporan kejadian banjir skala lingkungan/kecamatan.",
  },
  Basarnas: {
    scope: "Evakuasi & penyelamatan",
    response: "Target respons 10-20 menit",
    note: "Hubungi saat ada korban terjebak atau butuh evakuasi air deras.",
  },
  Ambulans: {
    scope: "Bantuan medis darurat",
    response: "Target respons 10-15 menit",
    note: "Prioritaskan untuk kondisi medis kritis selama kejadian banjir.",
  },
};

const evacuationGuide = [
  "Pantau notifikasi resmi dan ikuti instruksi petugas saat status merah aktif.",
  "Matikan listrik utama rumah dan amankan dokumen penting ke tempat kedap air.",
  "Bawa tas siaga, bantu lansia/anak, lalu bergerak ke titik evakuasi terdekat.",
  "Tetap di jalur aman dan hindari menerobos arus banjir atau kabel listrik terbuka.",
];

const emergencyKit = [
  "Dokumen penting (KTP, KK, surat berharga)",
  "Obat pribadi, P3K, dan masker",
  "Air minum, makanan siap saji, perlengkapan bayi",
  "Senter, powerbank, peluit, dan baterai cadangan",
  "Pakaian ganti dan perlengkapan kebersihan dasar",
];

const faqs = [
  {
    q: "Bagaimana data sensor diperbarui?",
    a: "Data sensor dikirim berkala ke sistem dan ditampilkan hampir real-time pada dashboard publik.",
  },
  {
    q: "Apa peran admin dalam sistem EWS?",
    a: "Admin mengelola sensor, memvalidasi data/alert, dan memastikan informasi darurat dikirim tepat waktu.",
  },
  {
    q: "Apa yang harus dilakukan saat status Kuning?",
    a: "Siapkan dokumen penting, tas siaga, dan pantau terus pembaruan status dari dashboard maupun petugas.",
  },
  {
    q: "Apakah tombol darurat bisa langsung menelepon?",
    a: "Ya, tombol menggunakan fitur one-click call, terutama efektif pada perangkat mobile.",
  },
];

const photoItems = [
  {
    title: "Pemantauan Debit Sungai",
    caption: "Sensor lapangan mengirim data perubahan tinggi muka air secara berkala.",
    src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Area Terdampak Banjir",
    caption: "Visual lapangan membantu admin menentukan prioritas respons darurat.",
    src: "https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Tim Operator & Admin",
    caption: "Admin mengelola sensor, memvalidasi alert, dan mengoordinasikan informasi ke publik.",
    src: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function Home() {
  return (
    <AuthRedirectWrapper>
      <main>
      <section id="home" className="relative isolate overflow-hidden text-white">
        <Image
          src={photoItems[0].src}
          alt={photoItems[0].title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/75 to-cyan-700/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_42%)]" />

        <div className="relative mx-auto flex min-h-[86vh] w-full max-w-6xl items-center justify-center px-6 py-20 md:py-24">
          <div className="max-w-3xl text-center">
            <Reveal className="flex flex-col items-center">
              <p className="mb-4 inline-block w-fit rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-50 backdrop-blur-sm">
                Platform Early Warning System
              </p>
              <h1 className="text-4xl font-bold leading-tight drop-shadow-sm md:text-6xl">
                Kelola Respons Banjir Lebih Cepat, Tepat, dan Terkoordinasi
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-blue-100 md:text-lg">
                Sistem peringatan dini berbasis sensor untuk membantu masyarakat memantau potensi banjir, memahami
                tingkat risiko, dan mengambil tindakan cepat saat kondisi darurat.
              </p>
            </Reveal>

            <Reveal delayMs={120} className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/#realtime-dashboard"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-950/20 transition-colors hover:bg-blue-50"
              >
                Lihat Dashboard Real-Time
              </Link>
              <Link
                href="/#emergency-action"
                className="rounded-lg border border-white/50 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                Tindakan Darurat
              </Link>
            </Reveal>

            <Reveal delayMs={200} className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-blue-100">
              <span className="rounded-full border border-white/35 bg-white/5 px-3 py-1 backdrop-blur-sm">Data real-time</span>
              <span className="rounded-full border border-white/35 bg-white/5 px-3 py-1 backdrop-blur-sm">Alert otomatis</span>
              <span className="rounded-full border border-white/35 bg-white/5 px-3 py-1 backdrop-blur-sm">Peta risiko interaktif</span>
            </Reveal>
          </div>
        </div>
      </section>

      <PublicRealtimeDashboardSection />

      <section id="status-legend" className="bg-blue-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <Reveal className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Edukasi Visual</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-900">Status Indicators & Legend</h2>
            <p className="mt-3 text-sm text-blue-800/80">
              Pahami kode warna status agar masyarakat dapat mengambil keputusan lebih cepat dan tepat.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {statusLegend.map((item, index) => (
              <Reveal key={item.title} delayMs={90 * (index + 1)}>
                <Card className="h-full border-blue-100 bg-white/95">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex h-3 w-16 rounded-full ${item.color}`} />
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>

                  <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800">Ambang indikator</p>
                    <p className="mt-1">{item.threshold}</p>
                  </div>

                  <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
                    <p className="font-semibold">Tindakan cepat</p>
                    <p className="mt-1 leading-relaxed">{item.action}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-1">
            <Reveal delayMs={380}>
              <div className="rounded-xl border border-blue-100 bg-white p-4 md:p-5">
                <h3 className="text-base font-semibold text-slate-900">Ringkasan Keputusan Cepat</h3>
                <div className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="font-semibold text-emerald-700">Normal</p>
                    <p className="mt-1">Pantau rutin, tidak perlu evakuasi.</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="font-semibold text-amber-700">Waspada</p>
                    <p className="mt-1">Siapkan rencana evakuasi keluarga.</p>
                  </div>
                  <div className="rounded-lg bg-rose-50 p-3">
                    <p className="font-semibold text-rose-700">Bahaya</p>
                    <p className="mt-1">Evakuasi segera ke titik aman resmi.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="emergency-action" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <Reveal className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Tindakan Cepat</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Emergency Action Section</h2>
            <p className="mt-3 text-sm text-slate-600">
              Tombol one-click call berikut memudahkan masyarakat menghubungi layanan darurat saat kondisi kritis.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {emergencyContacts.map((contact, index) => (
              <Reveal key={contact.name} delayMs={80 * (index + 1)}>
                <Card className="border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{contact.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">Nomor prioritas tanggap darurat</p>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">Fokus layanan</p>
                    <p className="mt-1">{emergencyMeta[contact.name]?.scope ?? "Respon darurat"}</p>
                    <p className="mt-2 font-semibold text-slate-900">Estimasi respons</p>
                    <p className="mt-1">{emergencyMeta[contact.name]?.response ?? "Secepat mungkin"}</p>
                  </div>

                  <a
                    href={`tel:${contact.phone}`}
                    className="mt-4 inline-flex rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                  >
                    Hubungi {contact.phone}
                  </a>

                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    {emergencyMeta[contact.name]?.note ?? "Sampaikan lokasi, jumlah korban, dan kondisi akses jalan secara singkat."}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={280} className="mt-4">
            <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 md:p-5">
              <h3 className="text-base font-semibold text-rose-900">Sebelum Menekan Tombol Darurat</h3>
              <ul className="mt-3 grid gap-2 text-sm text-rose-900/90 md:grid-cols-2">
                <li className="rounded-lg bg-white/70 px-3 py-2">Sebutkan lokasi detail (alamat/patok terdekat).</li>
                <li className="rounded-lg bg-white/70 px-3 py-2">Jelaskan kondisi air (tinggi, arus, akses jalan).</li>
                <li className="rounded-lg bg-white/70 px-3 py-2">Informasikan jumlah warga terdampak.</li>
                <li className="rounded-lg bg-white/70 px-3 py-2">Simpan daya baterai ponsel untuk komunikasi lanjutan.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="education-faq" className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <Reveal className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Flood Education & FAQ</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Panduan Keselamatan dan Persiapan Darurat</h2>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full border-blue-100">
                <h3 className="text-lg font-semibold text-slate-900">Panduan Evakuasi Saat Status Merah</h3>
                <ol className="mt-4 space-y-3 text-sm text-slate-700">
                  {evacuationGuide.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </Reveal>

            <Reveal delayMs={120}>
              <Card className="h-full border-blue-100">
                <h3 className="text-lg font-semibold text-slate-900">Daftar Barang Darurat Wajib</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {emergencyKit.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {faqs.map((item, index) => (
              <Reveal key={item.q} delayMs={70 * (index + 1)}>
                <Card className="h-full">
                  <h3 className="text-base font-semibold text-slate-900">{item.q}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.a}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </main>
    </AuthRedirectWrapper>
  );
}
