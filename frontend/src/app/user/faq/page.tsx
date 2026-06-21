"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

interface ContactSummaryItem {
  id: string;
  category: "BPBD" | "SAR" | "AMBULANCE" | "POLICE" | "HOSPITAL" | "OTHER";
}

function IconBell({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 17H9a3 3 0 0 1-3-3V11a5 5 0 0 1 10 0v3a3 3 0 0 1-3 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGuide({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4v16a1 1 0 0 0 1 1h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 4v16a1 1 0 0 0-1 1H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPhone({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92V20a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3.09a1 1 0 0 1 1 .75c.12.7.37 1.37.73 2a1 1 0 0 1-.24 1.09L8.91 8.91a16 16 0 0 0 6.2 6.2l1.07-1.07a1 1 0 0 1 1.09-.24c.63.36 1.3.61 2 .73a1 1 0 0 1 .75 1V16.92z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function UserFaqPage() {
  const { t, language } = useLanguage();
  const dict = translations[language] || translations.id;
  const userFaq = dict.userFaq;

  const [stats, setStats] = useState({
    alertCount: 0,
    emergencyContacts: 0,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const [historyResp, contactsResp] = await Promise.all([
          api.get("/alerts/history", { params: { page: 1, limit: 1 } }),
          api.get("/emergency-contacts"),
        ]);

        const totalAlerts = Number(historyResp.data?.data?.pagination?.total ?? 0);
        const contacts = (contactsResp.data?.data ?? []) as ContactSummaryItem[];

        if (!cancelled) {
          setStats({
            alertCount: totalAlerts,
            emergencyContacts: contacts.length,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) {
          setStats((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      }
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:max-w-5xl">
      {/* Hero / Header */}
      <section className="rounded-2xl bg-linear-to-tr from-slate-50 to-white p-5 shadow-sm border border-slate-100">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{userFaq.tagLabel}</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">{userFaq.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{userFaq.subtitle}</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-lg bg-white/80 p-3 shadow">
              <IconBell className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card className="flex items-center gap-4 rounded-xl border border-blue-50 bg-linear-to-r from-white to-blue-50 p-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <IconBell className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{userFaq.totalNotifications}</p>
              <p className="mt-1 text-3xl font-extrabold text-blue-600">{stats.loading ? "—" : stats.alertCount}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 rounded-xl border border-rose-50 bg-white p-4">
            <div className="rounded-lg bg-rose-100 p-3">
              <IconPhone className="text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">{userFaq.emergencyContacts}</p>
              <p className="mt-1 text-3xl font-extrabold text-rose-600">{stats.loading ? "—" : stats.emergencyContacts}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ list */}
      <section className="mt-6">
        <div className="space-y-3">
          {userFaq.faqItems.map((item) => (
            <details key={item.q} className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none text-base font-semibold text-slate-900">
                <span className="pr-4">{item.q}</span>
                <span className="ml-4 flex items-center text-slate-500 transition-transform duration-200 group-open:rotate-180"> 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-90" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Quick access */}
      <section className="mt-6">
        <h2 className="text-base font-semibold text-slate-900 mb-3">{userFaq.quickAccessTitle}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/user/notifications" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50">
            <div className="rounded-md bg-blue-50 p-2">
              <IconBell className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{userFaq.navNotifications}</p>
              <p className="text-xs text-slate-500">{userFaq.navNotificationsDesc}</p>
            </div>
          </Link>

          <Link href="/user/education" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50">
            <div className="rounded-md bg-amber-50 p-2">
              <IconGuide className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{userFaq.navGuides}</p>
              <p className="text-xs text-slate-500">{userFaq.navGuidesDesc}</p>
            </div>
          </Link>

          <Link href="/user/emergency" className="flex items-center gap-3 rounded-xl border border-rose-50 bg-rose-50/70 p-4 shadow-md hover:bg-rose-100">
            <div className="rounded-md bg-rose-600 p-2 text-white">
              <IconPhone className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900">{userFaq.navEmergency}</p>
              <p className="text-xs text-rose-800">{userFaq.navEmergencyDesc}</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
