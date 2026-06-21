"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

export default function UserSettingsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { user, isAuthenticated, updateProfile } = useAuth();

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [institution, setInstitution] = useState("");
  
  // Notification switches state
  const [notificationFlood, setNotificationFlood] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Load user data into local state when user updates
  useEffect(() => {
    if (user) {
      setWhatsappNumber(user.whatsappNumber ?? "");
      setInstitution(user.institution ?? "");
      setNotificationFlood(user.notificationFlood ?? true);
      setNotificationStatus(user.notificationStatus ?? true);
      setNotificationEmail(user.notificationEmail ?? false);
    }
  }, [user]);

  // Handle saving the user settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.put("/auth/profile", {
        phone: whatsappNumber,
        institution,
        notificationFlood,
        notificationStatus,
        notificationEmail,
      });

      const updatedUser = response.data?.data;
      if (updatedUser) {
        updateProfile({
          whatsappNumber: updatedUser.phone ?? whatsappNumber,
          institution: updatedUser.institution ?? institution,
          notificationFlood: updatedUser.notificationFlood ?? notificationFlood,
          notificationStatus: updatedUser.notificationStatus ?? notificationStatus,
          notificationEmail: updatedUser.notificationEmail ?? notificationEmail,
        });
      }

      setMessage({ type: "success", text: t("userSettings.saveSuccess") });
    } catch {
      setMessage({ type: "error", text: t("userSettings.saveFailed") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setWhatsappNumber(user.whatsappNumber ?? "");
      setInstitution(user.institution ?? "");
      setNotificationFlood(user.notificationFlood ?? true);
      setNotificationStatus(user.notificationStatus ?? true);
      setNotificationEmail(user.notificationEmail ?? false);
      setMessage({ type: "success", text: t("userSettings.resetSuccess") });
    }
    setResetConfirmOpen(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <main className="mx-auto max-w-3xl px-6">
        
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              &larr; {t("userSettings.back")}
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t("userSettings.title")}</h1>
            <p className="mt-1 text-slate-500 text-sm">{t("userSettings.subtitle")}</p>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </header>

        {/* Settings Container */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-10">
          <form onSubmit={handleSave} className="flex flex-col gap-8">
            
            {/* Bagian Hubungan & Saluran Kontak */}
            <section className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">{t("userSettings.contactHeader")}</h2>
                <p className="text-xs text-slate-500">{t("userSettings.contactDesc")}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">{t("userSettings.fieldPhone")}</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder={t("userSettings.fieldPhonePlaceholder")}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white text-slate-900 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400">{t("userSettings.fieldPhoneDesc")}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">{t("userSettings.fieldInstitution")}</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder={t("userSettings.fieldInstitutionPlaceholder")}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none bg-white text-slate-900 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400">{t("userSettings.fieldInstitutionDesc")}</p>
                </div>
              </div>
            </section>

            {/* Bagian Preferensi Peringatan */}
            <section className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">{t("userSettings.preferencesHeader")}</h2>
                <p className="text-xs text-slate-500">{t("userSettings.preferencesDesc")}</p>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Flood Alert Toggle */}
                <div className="flex items-center justify-between py-4">
                  <div className="max-w-[80%] pr-4">
                    <p className="text-sm font-bold text-slate-800">{t("userSettings.prefFloodTitle")}</p>
                    <p className="text-xs text-slate-500">
                      {t("userSettings.prefFloodDesc")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationFlood((prev) => !prev)}
                    aria-label="Toggle flood alert"
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationFlood ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        notificationFlood ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Device Status Toggle */}
                <div className="flex items-center justify-between py-4">
                  <div className="max-w-[80%] pr-4">
                    <p className="text-sm font-bold text-slate-800">{t("userSettings.prefStatusTitle")}</p>
                    <p className="text-xs text-slate-500">
                      {t("userSettings.prefStatusDesc")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationStatus((prev) => !prev)}
                    aria-label="Toggle status updates"
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationStatus ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        notificationStatus ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Email Alert Toggle */}
                <div className="flex items-center justify-between py-4">
                  <div className="max-w-[80%] pr-4">
                    <p className="text-sm font-bold text-slate-800">{t("userSettings.prefEmailTitle")}</p>
                    <p className="text-xs text-slate-500">
                      {t("userSettings.prefEmailDesc")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationEmail((prev) => !prev)}
                    aria-label="Toggle email alert"
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationEmail ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        notificationEmail ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {message.text && (
              <div
                className={`rounded-xl p-4 text-sm font-medium ${
                  message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                {t("userSettings.resetBtn")}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? t("userSettings.saving") : t("userSettings.saveBtn")}
              </button>
            </div>

          </form>
        </div>

        <ConfirmDialog
          open={resetConfirmOpen}
          title={t("userSettings.confirmTitle")}
          description={t("userSettings.confirmDesc")}
          confirmText={t("userSettings.confirmYes")}
          cancelText={t("userSettings.confirmCancel")}
          onCancel={() => setResetConfirmOpen(false)}
          onConfirm={handleReset}
        />
      </main>
    </div>
  );
}
