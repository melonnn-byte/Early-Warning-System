import Link from "next/link";
import { Card } from "@/components/ui/Card";

const quickMenu = [
  { href: "#status-level", label: "Level Status" },
  { href: "#rencana-3-fase", label: "Rencana 3 Fase" },
  { href: "#checklist-siaga", label: "Checklist Siaga" },
  { href: "#evakuasi", label: "Do & Don't Evakuasi" },
  { href: "#faq", label: "FAQ" },
];

const statusGuides = [
  {
    id: "status-hijau",
    level: "Hijau (Normal)",
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    indicatorClass: "bg-emerald-500",
    meaning: "Kondisi masih aman, namun pemantauan tetap diperlukan untuk mendeteksi perubahan cepat.",
    actionNow: [
      "Cek dashboard minimal setiap 30 menit.",
      "Pastikan notifikasi di ponsel tetap aktif.",
      "Ingatkan anggota keluarga tentang rute evakuasi dasar.",
    ],
  },
  {
    id: "status-kuning",
    level: "Kuning (Waspada)",
    className: "border-amber-200 bg-amber-50 text-amber-900",
    indicatorClass: "bg-amber-500",
    meaning: "Tinggi air mulai meningkat. Waktu terbaik untuk bersiap agar evakuasi tidak panik.",
    actionNow: [
      "Pantau dashboard tiap 10-15 menit untuk melihat tren kenaikan.",
      "Siapkan tas siaga, dokumen penting, obat, dan kebutuhan anak/lansia.",
      "Isi daya ponsel dan siapkan power bank.",
    ],
  },
  {
    id: "status-oren",
    level: "Oren (Siaga)",
    className: "border-orange-200 bg-orange-50 text-orange-900",
    indicatorClass: "bg-orange-500",
    meaning: "Risiko banjir semakin tinggi. Persiapan harus beralih ke tindakan pra-evakuasi.",
    actionNow: [
      "Pindahkan barang penting ke tempat lebih tinggi.",
      "Siapkan anggota keluarga rentan (anak, lansia, disabilitas) untuk berangkat lebih awal.",
      "Konfirmasi jalur evakuasi dan titik kumpul terdekat.",
    ],
  },
  {
    id: "status-merah",
    level: "Merah (Bahaya)",
    className: "border-rose-200 bg-rose-50 text-rose-900",
    indicatorClass: "bg-rose-500",
    meaning: "Kondisi kritis. Prioritas utama adalah keselamatan jiwa dan evakuasi segera.",
    actionNow: [
      "Evakuasi segera ke lokasi aman resmi.",
      "Matikan listrik utama bila kondisi memungkinkan dan aman.",
      "Ikuti instruksi BPBD/SAR, jangan menerobos arus banjir.",
    ],
  },
];

const phasePlan = [
  {
    id: "fase-sebelum",
    title: "Sebelum Banjir",
    subtitle: "Bangun kesiapan keluarga",
    className: "border-blue-200 bg-blue-50",
    steps: [
      "Simpan nomor darurat (BPBD, SAR, Damkar, medis) di kontak favorit.",
      "Diskusikan rute evakuasi dan titik kumpul keluarga.",
      "Simpan dokumen penting dalam map tahan air.",
      "Latih komunikasi singkat saat darurat: lokasi, jumlah orang, dan kondisi akses.",
    ],
  },
  {
    id: "fase-saat",
    title: "Saat Peringatan Aktif",
    subtitle: "Ambil keputusan cepat dan terukur",
    className: "border-amber-200 bg-amber-50",
    steps: [
      "Periksa status sensor terdekat lewat Dashboard dan Peta Sensor.",
      "Prioritaskan evakuasi anggota keluarga rentan terlebih dahulu.",
      "Hindari menyebarkan info yang belum terverifikasi.",
      "Gunakan jalur evakuasi resmi dan laporkan hambatan ke petugas.",
    ],
  },
  {
    id: "fase-sesudah",
    title: "Setelah Kondisi Mereda",
    subtitle: "Kembali aman secara bertahap",
    className: "border-emerald-200 bg-emerald-50",
    steps: [
      "Masuk rumah hanya jika ada konfirmasi aman dari petugas setempat.",
      "Periksa instalasi listrik dan air sebelum digunakan.",
      "Catat kebutuhan mendesak (obat, makanan, sanitasi) untuk koordinasi bantuan.",
      "Evaluasi rencana keluarga: apa yang sudah baik, apa yang perlu diperbaiki.",
    ],
  },
];

const emergencyChecklist = [
  "Dokumen penting (KTP, KK, akta, surat berharga) dalam pelindung tahan air",
  "Obat rutin keluarga, P3K, masker, dan hand sanitizer",
  "Air minum, makanan siap saji, perlengkapan bayi/lansia",
  "Senter, peluit, power bank, baterai cadangan",
  "Pakaian ganti, selimut ringan, perlengkapan kebersihan",
  "Uang tunai secukupnya dan daftar kontak penting",
];

const doList = [
  "Gunakan alas kaki anti-slip saat evakuasi.",
  "Sampaikan lokasi dengan patokan jelas saat menghubungi darurat.",
  "Bantu tetangga rentan jika kondisi memungkinkan.",
  "Pantau pembaruan resmi secara berkala.",
];

const dontList = [
  "Jangan melintasi arus banjir deras walau terlihat dangkal.",
  "Jangan menyalakan listrik di area yang masih basah.",
  "Jangan menunggu terlalu lama saat status sudah merah.",
  "Jangan percaya hoaks atau informasi tanpa sumber resmi.",
];

const faqs = [
  {
    q: "Bagaimana cara membaca warna status di dashboard?",
    a: "Hijau berarti normal, Kuning waspada, Oren siaga, dan Merah bahaya. Semakin tinggi level, semakin cepat tindakan evakuasi harus dilakukan.",
  },
  {
    q: "Kapan saya harus menghubungi kontak darurat?",
    a: "Segera hubungi saat status merah, ada arus air berbahaya, atau ada anggota keluarga/warga yang membutuhkan bantuan medis dan evakuasi segera.",
  },
  {
    q: "Apakah notifikasi selalu muncul otomatis?",
    a: "Ya, notifikasi muncul saat ada perubahan level penting pada sensor. Pastikan izin notifikasi browser/perangkat tidak diblokir.",
  },
  {
    q: "Apa informasi minimum saat menelepon layanan darurat?",
    a: "Sebutkan lokasi spesifik, jumlah warga terdampak, kondisi air/akses jalan, serta kebutuhan bantuan yang paling mendesak.",
  },
  {
    q: "Jika saya ragu harus evakuasi atau tidak, apa yang harus dilakukan?",
    a: "Gunakan prinsip aman terlebih dahulu. Jika status naik ke oren/merah dan ada tanda peningkatan air, lakukan evakuasi dini ke titik aman resmi.",
  },
];

export default function UserEducationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <section className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Panduan User</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Pusat Panduan Kesiapsiagaan Banjir</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
          Halaman ini dirancang agar informasi mudah dipahami dalam sekali lihat: mulai dari arti level status,
          langkah cepat per fase, checklist tas siaga, hingga panduan evakuasi yang aman.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickMenu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section id="status-level" className="mt-6 scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-slate-900">Level Status & Tindakan Cepat</h2>
          <p className="mt-1 text-sm text-slate-600">Fokus pada bagian ini saat menerima notifikasi agar keputusan lebih cepat dan tepat.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {statusGuides.map((guide) => (
            <Card key={guide.id} className={`border ${guide.className}`}>
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-3 w-3 rounded-full ${guide.indicatorClass}`} aria-hidden="true" />
                <h3 className="text-base font-semibold">{guide.level}</h3>
              </div>

              <p className="mt-2 text-sm leading-relaxed">{guide.meaning}</p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide">Aksi 10 menit pertama</p>
              <ol className="mt-2 space-y-2 text-sm">
                {guide.actionNow.map((step, index) => (
                  <li key={`${guide.id}-${step}`} className="flex gap-2">
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/75 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      <section id="rencana-3-fase" className="mt-8 scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-slate-900">Rencana Tindakan 3 Fase</h2>
          <p className="mt-1 text-sm text-slate-600">Gunakan alur ini sebagai panduan keluarga sebelum, saat, dan setelah kejadian banjir.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {phasePlan.map((phase, index) => (
            <Card key={phase.id} className={`border ${phase.className}`}>
              <span className="inline-flex rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700">Fase {index + 1}</span>
              <h3 className="mt-2 text-base font-bold text-slate-900">{phase.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{phase.subtitle}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-800">
                {phase.steps.map((step) => (
                  <li key={`${phase.id}-${step}`} className="flex gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-slate-500" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section id="checklist-siaga" className="mt-8 scroll-mt-24">
        <Card className="border-blue-100 bg-blue-50/40">
          <h2 className="text-xl font-bold text-slate-900">Checklist Tas Siaga 72 Jam</h2>
          <p className="mt-1 text-sm text-slate-600">
            Simpan perlengkapan ini di tempat yang mudah dijangkau agar proses evakuasi bisa dilakukan tanpa menunggu lama.
          </p>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {emergencyChecklist.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700">
                <span className="mt-0.5 text-blue-600" aria-hidden="true">☑</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="evakuasi" className="mt-8 scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-slate-900">Do &amp; Don&apos;t Saat Evakuasi</h2>
          <p className="mt-1 text-sm text-slate-600">Petunjuk singkat ini membantu mengurangi risiko cedera saat proses penyelamatan.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-200 bg-emerald-50">
            <h3 className="text-base font-bold text-emerald-900">Yang Harus Dilakukan</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900">
              {doList.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">✅</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-rose-200 bg-rose-50">
            <h3 className="text-base font-bold text-rose-900">Yang Harus Dihindari</h3>
            <ul className="mt-3 space-y-2 text-sm text-rose-900">
              {dontList.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">⛔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section id="faq" className="mt-8 scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-slate-900">FAQ Cepat</h2>
          <p className="mt-1 text-sm text-slate-600">Pertanyaan umum yang paling sering muncul dari pengguna.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer list-none pr-6 text-base font-semibold text-slate-900 marker:content-none">
                {item.q}
                <span className="ml-2 text-slate-500 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Card className="border-blue-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Akses Cepat Fitur User</h2>
          <p className="mt-1 text-sm text-slate-600">Gunakan halaman terkait berikut untuk mengambil tindakan langsung.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/user/dashboard" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Buka Dashboard
            </Link>
            <Link href="/user/notifications" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cek Notifikasi
            </Link>
            <Link href="/user/map" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Lihat Peta Sensor
            </Link>
            <Link href="/user/emergency" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Kontak Darurat
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
