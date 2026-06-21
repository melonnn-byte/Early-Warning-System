"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">{t("common.notFoundTitle")}</h1>
      <p className="text-slate-600">{t("common.notFoundDesc")}</p>
      <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        {t("common.notFoundBtn")}
      </Link>
    </main>
  );
}
