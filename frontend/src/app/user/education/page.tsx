"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

export default function UserEducationPage() {
  const { t, language } = useLanguage();
  const dict = translations[language] || translations.id;
  const userEdu = dict.userEducation;

  const quickMenu = [
    { href: "#aksi-kuning", label: userEdu.quickMenus.yellow },
    { href: "#aksi-oren", label: userEdu.quickMenus.orange },
    { href: "#aksi-merah", label: userEdu.quickMenus.red },
    { href: "#checklist-siaga", label: userEdu.quickMenus.checklist },
    { href: "#faq", label: userEdu.quickMenus.faq },
  ];

  const statusGuides = [
    {
      id: "aksi-kuning" as const,
      level: userEdu.guides.yellow.level,
      className: "border-amber-200 bg-amber-50 text-amber-900",
      indicatorClass: "bg-amber-500",
      summary: userEdu.guides.yellow.summary,
      actionNow: userEdu.guides.yellow.actions,
      avoidNow: userEdu.guides.yellow.avoids,
    },
    {
      id: "aksi-oren" as const,
      level: userEdu.guides.orange.level,
      className: "border-orange-200 bg-orange-50 text-orange-900",
      indicatorClass: "bg-orange-500",
      summary: userEdu.guides.orange.summary,
      actionNow: userEdu.guides.orange.actions,
      avoidNow: userEdu.guides.orange.avoids,
    },
    {
      id: "aksi-merah" as const,
      level: userEdu.guides.red.level,
      className: "border-rose-200 bg-rose-50 text-rose-900",
      indicatorClass: "bg-rose-500",
      summary: userEdu.guides.red.summary,
      actionNow: userEdu.guides.red.actions,
      avoidNow: userEdu.guides.red.avoids,
    },
  ];

  const emergencyChecklist = userEdu.checklistItems;
  const doList = userEdu.doList;
  const dontList = userEdu.dontList;
  const faqs = userEdu.faqItems;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <section className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{userEdu.tagLabel}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{userEdu.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
          {userEdu.subtitle}
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

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{userEdu.summaryTitle}</p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">{userEdu.summaryHeader}</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-700">
            <li>{userEdu.summaryItem1}</li>
            <li>{userEdu.summaryItem2}</li>
            <li>{userEdu.summaryItem3}</li>
          </ol>
        </Card>
        <Card className="border-blue-200 bg-blue-50 md:col-span-2">
          <h2 className="text-base font-semibold text-blue-900">{userEdu.relationTitle}</h2>
          <p className="mt-2 text-sm text-blue-900/90">
            {userEdu.relationDesc}
          </p>
        </Card>
      </section>

      <section className="mt-8 space-y-4">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-slate-900">{userEdu.guideTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{userEdu.guideSubtitle}</p>
        </div>

        {statusGuides.map((guide) => (
          <section id={guide.id} key={guide.id} className="scroll-mt-24">
            <Card className={`border ${guide.className}`}>
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-3 w-3 rounded-full ${guide.indicatorClass}`} aria-hidden="true" />
                <h3 className="text-lg font-semibold">{guide.level}</h3>
              </div>

              <p className="mt-2 text-sm leading-relaxed">{guide.summary}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide">{userEdu.doTitle}</p>
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
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide">{userEdu.dontTitle}</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    {guide.avoidNow.map((item) => (
                      <li key={`${guide.id}-${item}`} className="flex gap-2">
                        <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-slate-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </section>
        ))}
      </section>

      <section id="checklist-siaga" className="mt-8 scroll-mt-24">
        <Card className="border-blue-100 bg-blue-50/40">
          <h2 className="text-xl font-bold text-slate-900">{userEdu.checklistTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {userEdu.checklistSubtitle}
          </p>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {emergencyChecklist.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700">
                <span className="mt-0.5 text-blue-600" aria-hidden="true">-</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="evakuasi" className="mt-8 scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-slate-900">{userEdu.doDontTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{userEdu.doDontSubtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-200 bg-emerald-50">
            <h3 className="text-base font-bold text-emerald-900">{userEdu.doHeader}</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900">
              {doList.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-rose-200 bg-rose-50">
            <h3 className="text-base font-bold text-rose-900">{userEdu.dontHeader}</h3>
            <ul className="mt-3 space-y-2 text-sm text-rose-900">
              {dontList.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true">x</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section id="faq" className="mt-8 scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-slate-900">{userEdu.faqTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{userEdu.faqSubtitle}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer list-none pr-6 text-base font-semibold text-slate-900 marker:content-none flex items-center justify-between">
                <span>{item.q}</span>
                <svg
                  className="size-4 text-slate-500 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <Card className="border-blue-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">{userEdu.quickAccessTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{userEdu.quickAccessSubtitle}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/user/dashboard" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              {userEdu.openDashboard}
            </Link>
            <Link href="/user/notifications" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {userEdu.checkNotifications}
            </Link>
            <Link href="/user/map" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {userEdu.viewSensorMap}
            </Link>
            <Link href="/user/emergency" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {userEdu.emergencyContact}
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
