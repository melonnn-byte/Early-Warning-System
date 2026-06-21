"use client";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/lib/LanguageContext";

export default function EducationPage() {
  const { t } = useLanguage();

  const actionGuides = [
    {
      id: "aksi-kuning",
      level: t("publicEducation.yellowLevel"),
      className: "bg-amber-50 border-amber-200 text-amber-900",
      steps: [
        t("publicEducation.guides.yellow.0"),
        t("publicEducation.guides.yellow.1"),
        t("publicEducation.guides.yellow.2"),
      ],
    },
    {
      id: "aksi-oren",
      level: t("publicEducation.orangeLevel"),
      className: "bg-orange-50 border-orange-200 text-orange-900",
      steps: [
        t("publicEducation.guides.orange.0"),
        t("publicEducation.guides.orange.1"),
        t("publicEducation.guides.orange.2"),
      ],
    },
    {
      id: "aksi-merah",
      level: t("publicEducation.redLevel"),
      className: "bg-rose-50 border-rose-200 text-rose-900",
      steps: [
        t("publicEducation.guides.red.0"),
        t("publicEducation.guides.red.1"),
        t("publicEducation.guides.red.2"),
      ],
    },
  ];

  const faqs = [
    {
      q: t("publicEducation.faqItems.0.q"),
      a: t("publicEducation.faqItems.0.a"),
    },
    {
      q: t("publicEducation.faqItems.1.q"),
      a: t("publicEducation.faqItems.1.a"),
    },
    {
      q: t("publicEducation.faqItems.2.q"),
      a: t("publicEducation.faqItems.2.a"),
    },
  ];

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">{t("publicEducation.title")}</h1>
      <p className="mb-6 text-sm text-slate-600">
        {t("publicEducation.subtitle")}
      </p>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {actionGuides.map((guide) => (
          <Card key={guide.id} className={`border ${guide.className}`}>
            <h2 className="text-base font-semibold">{t("publicEducation.guideTitle", { level: guide.level })}</h2>
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
              <h2 className="text-lg font-bold">{t("publicEducation.guideDetailTitle", { level: guide.level })}</h2>
              <p className="mt-1 text-sm">{t("publicEducation.guideDetailDesc", { level: guide.level.toLowerCase() })}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {guide.steps.map((step) => (
                  <li key={`${guide.id}-${step}`}>• {step}</li>
                ))}
              </ul>
            </Card>
          </section>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-bold text-slate-900">{t("publicEducation.faqTitle")}</h2>

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
