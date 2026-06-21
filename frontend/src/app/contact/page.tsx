"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: string;
  isActive: boolean;
}

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/emergency-contacts");
        if (res.data?.data) {
          setEmergencyContacts(res.data.data.filter((c: EmergencyContact) => c.isActive));
        }
      } catch (err) {
        console.error("Gagal memuat kontak darurat:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "BPBD":
        return "BPBD";
      case "SAR":
        return "SAR / Basarnas";
      case "AMBULANCE":
        return language === "en" ? "Ambulance" : "Ambulans";
      case "POLICE":
        return language === "en" ? "Police" : "Polisi";
      case "HOSPITAL":
        return language === "en" ? "Hospital" : "Rumah Sakit";
      case "OTHER":
      default:
        return language === "en" ? "Other" : "Lainnya";
    }
  };

  const supportChannels = [
    {
      title: t("publicContact.supportChannels.email.title"),
      value: "support@ewsfloodguard.id",
      actionLabel: t("publicContact.supportChannels.email.action"),
      href: "mailto:support@ewsfloodguard.id",
    },
    {
      title: t("publicContact.supportChannels.phone.title"),
      value: "+62 21 555 0199",
      actionLabel: t("publicContact.supportChannels.phone.action"),
      href: "tel:+62215550199",
    },
    {
      title: t("publicContact.supportChannels.address.title"),
      value: t("publicContact.supportChannels.address.value"),
      actionLabel: t("publicContact.supportChannels.address.action"),
      href: "https://www.google.com/maps?q=Padang,Sumatera+Barat",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="rounded-2xl bg-linear-to-br from-blue-900 via-blue-700 to-cyan-600 p-7 text-white md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("publicContact.pageLabel")}</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t("publicContact.title")}</h1>
        <p className="mt-3 max-w-3xl text-sm text-blue-100 md:text-base">
          {t("publicContact.subtitle")}
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {supportChannels.map((channel) => (
          <Card key={channel.title} className="border-blue-100">
            <h2 className="text-lg font-semibold text-slate-900">{channel.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{channel.value}</p>
            <a
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {channel.actionLabel}
            </a>
          </Card>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">{t("publicContact.emergencyTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {t("publicContact.emergencyDesc")}
        </p>

        {isLoading ? (
          <div className="mt-4 py-6 text-center text-sm text-slate-500">
            {language === "en" ? "Loading contacts..." : "Memuat kontak..."}
          </div>
        ) : emergencyContacts.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.id}
                href={`tel:${contact.phone}`}
                className="rounded-lg border border-rose-200 bg-rose-50 p-4 transition-colors hover:bg-rose-100"
              >
                <p className="font-semibold text-rose-900">{contact.name}</p>
                <span className="mt-0.5 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-600">
                  {getCategoryLabel(contact.category)}
                </span>
                <p className="mt-1 text-sm font-mono font-semibold text-rose-700">{contact.phone}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-6 text-center text-sm text-slate-500">
            {t("publicContact.emptyContacts")}
          </div>
        )}
      </section>
    </main>
  );
}
