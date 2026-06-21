"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

interface EmergencyContactItem {
  id: string;
  name: string;
  phone: string;
  category: "BPBD" | "SAR" | "AMBULANCE" | "POLICE" | "HOSPITAL" | "OTHER";
}

const emergencyStyles: Record<
  EmergencyContactItem["category"],
  {
    badgeClass: string;
    buttonClass: string;
  }
> = {
  BPBD: {
    badgeClass: "bg-blue-100 text-blue-700",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
  },
  SAR: {
    badgeClass: "bg-amber-100 text-amber-700",
    buttonClass: "bg-amber-600 hover:bg-amber-700",
  },
  AMBULANCE: {
    badgeClass: "bg-rose-100 text-rose-700",
    buttonClass: "bg-rose-600 hover:bg-rose-700",
  },
  POLICE: {
    badgeClass: "bg-indigo-100 text-indigo-700",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700",
  },
  HOSPITAL: {
    badgeClass: "bg-teal-100 text-teal-700",
    buttonClass: "bg-teal-600 hover:bg-teal-700",
  },
  OTHER: {
    badgeClass: "bg-slate-100 text-slate-700",
    buttonClass: "bg-slate-700 hover:bg-slate-800",
  },
};

export default function UserEmergencyPage() {
  const { t, language } = useLanguage();
  const dict = translations[language] || translations.id;
  const userEmerg = dict.userEmergency;

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactItem[]>([]);

  const quickActions = [
    { label: language === "en" ? "Monitor Dashboard" : "Pantau Dashboard", href: "/user/dashboard" },
    { label: language === "en" ? "View Sensor Map" : "Lihat Peta Sensor", href: "/user/map" },
    { label: language === "en" ? "Open Guide" : "Buka Panduan", href: "/user/education" },
    { label: language === "en" ? "Check Notifications" : "Cek Notifikasi", href: "/user/notifications" },
  ];

  const callChecklist = language === "en" ? [
    "State your exact location (address, nearby landmarks, or Google Maps pin).",
    "Explain the current situation: water height, current speed, road access, and weather.",
    "Inform the number of affected residents and vulnerable groups (children/elderly/disabled).",
    "Convey the most urgent needs: evacuation, medical, logistics, or rescue."
  ] : [
    "Sebutkan lokasi detail (alamat, patokan terdekat, atau titik Google Maps).",
    "Jelaskan kondisi saat ini: tinggi air, arus, akses jalan, dan cuaca.",
    "Informasikan jumlah warga terdampak dan kelompok rentan (anak/lansia/disabilitas).",
    "Sampaikan kebutuhan paling mendesak: evakuasi, medis, logistik, atau penyelamatan.",
  ];

  function sanitizePhoneForTel(phone: string) {
    return phone.replace(/[^+\d]/g, "");
  }

  useEffect(() => {
    let cancelled = false;

    const loadContacts = async () => {
      try {
        const response = await api.get("/emergency-contacts");
        const rows = (response.data?.data ?? []) as EmergencyContactItem[];

        if (!cancelled) {
          setEmergencyContacts(rows);
        }
      } catch {
        if (!cancelled) {
          setEmergencyContacts([]);
        }
      }
    };

    void loadContacts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <section className="rounded-2xl border border-rose-100 bg-linear-to-br from-rose-50 via-white to-blue-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">{userEmerg.tagLabel}</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{userEmerg.title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              {userEmerg.subtitle}
            </p>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-semibold">{userEmerg.priorityTitle}</p>
            <p className="mt-1 text-xs text-rose-800/90">{userEmerg.priorityDesc}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickActions.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{userEmerg.servicesTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{userEmerg.servicesSubtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {emergencyContacts.map((contact) => {
            const styles = emergencyStyles[contact.category] ?? emergencyStyles.OTHER;
            const meta = userEmerg.meta[contact.category] ?? userEmerg.meta.OTHER;

            return (
              <Card key={contact.id} className="h-full border-slate-200 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{contact.name}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badgeClass}`}>
                    {userEmerg.badgePriority}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-600">{userEmerg.phoneLabel}</p>
                <p className="mt-0.5 text-2xl font-bold tracking-wide text-slate-900">{contact.phone}</p>

                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">{userEmerg.focusLabel}</p>
                  <p className="mt-1 leading-relaxed">{meta.scope}</p>

                  <p className="mt-2 font-semibold text-slate-900">{userEmerg.responseLabel}</p>
                  <p className="mt-1">{meta.response}</p>
                </div>

                <a
                  href={`tel:${sanitizePhoneForTel(contact.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${styles.buttonClass}`}
                >
                  {userEmerg.callBtn.replace("{phone}", contact.phone)}
                </a>

                <p className="mt-3 text-xs leading-relaxed text-slate-500">{meta.note}</p>
              </Card>
            );
          })}
        </div>

        {emergencyContacts.length === 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {userEmerg.noData}
          </div>
        )}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="border-rose-100 bg-rose-50 lg:col-span-2">
          <h2 className="text-base font-semibold text-rose-900">{userEmerg.checklistTitle}</h2>
          <p className="mt-1 text-sm text-rose-900/90">
            {userEmerg.checklistSubtitle}
          </p>

          <ul className="mt-3 space-y-2 text-sm text-rose-900/95">
            {callChecklist.map((item) => (
              <li key={item} className="flex gap-2 rounded-lg bg-white/75 px-3 py-2">
                <span className="mt-0.5" aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-slate-200 bg-slate-50">
          <h2 className="text-base font-semibold text-slate-900">{userEmerg.flowTitle}</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-700">
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">{userEmerg.flowItem1}</li>
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">{userEmerg.flowItem2}</li>
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2">{userEmerg.flowItem3}</li>
          </ol>
        </Card>
      </section>
    </main>
  );
}
