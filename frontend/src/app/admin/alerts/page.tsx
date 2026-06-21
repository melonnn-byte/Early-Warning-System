"use client";
import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatTimestamp } from "@/lib/utils";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

type AlertLevel = "Aman" | "Waspada" | "Bahaya";
type Channel = "push" | "email";

const CHANNEL_LABELS: Record<Channel, string> = {
  push: "Push",
  email: "Email",
};

export default function AdminAlertsPage() {
  const { t, language } = useLanguage();

  const [target, setTarget] = useState("Semua Wilayah");
  const [level, setLevel] = useState<AlertLevel>("Waspada");
  const [channels, setChannels] = useState<Record<Channel, boolean>>({
    push: true,
    email: false,
  });
  const [message, setMessage] = useState("Waspada kenaikan debit air di sektor hilir. Mohon siaga dan pantau instruksi lanjutan.");
  const [title, setTitle] = useState("Peringatan Kenaikan Debit Air");
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmBroadcastOpen, setConfirmBroadcastOpen] = useState(false);
  const [history, setHistory] = useState<Array<{
    id: string;
    sentAt: string;
    level: AlertLevel;
    channels: string[];
    sender: string;
    status: "Berhasil" | "Gagal";
  }>>([]);

  const loadHistory = async () => {
    setErrorMessage(null);
    try {
      const response = await api.get("/alerts/history", {
        params: { page: 1, limit: 50 },
      });
      const items = (response.data?.data?.items ?? []) as Array<{
        id: string;
        sentAt: string;
        severity: "INFO" | "WARNING" | "DANGER";
        channels: string[];
        user?: { name?: string };
      }>;

      setHistory(
        items.map((item) => ({
          id: item.id,
          sentAt: item.sentAt,
          level:
            item.severity === "DANGER"
              ? "Bahaya"
              : item.severity === "WARNING"
                ? "Waspada"
                : "Aman",
          channels: item.channels,
          sender: item.user?.name ?? t("adminAlerts.senderDefault"),
          status: "Berhasil",
        })),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t("adminAlerts.loadHistoryError"));
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHistory();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const toggleChannel = (key: Channel) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyTemplate = (type: "evakuasi" | "waspada") => {
    if (type === "evakuasi") {
      setLevel("Bahaya");
      setTitle(t("adminAlerts.templates.evacTitle"));
      setMessage(t("adminAlerts.templates.evacMessage"));
      return;
    }

    setLevel("Waspada");
    setTitle(t("adminAlerts.templates.warnTitle"));
    setMessage(t("adminAlerts.templates.warnMessage"));
  };

  const sendAlert = async () => {
    setErrorMessage(null);
    setSent(false);

    const usedChannels = (Object.keys(channels) as Channel[]).filter((key) => channels[key]);

    if (usedChannels.length === 0) {
      setErrorMessage(t("adminAlerts.chooseChannelError"));
      return;
    }

    try {
      await api.post("/alerts/broadcast", {
        title,
        message,
        severity: level === "Bahaya" ? "DANGER" : level === "Waspada" ? "WARNING" : "INFO",
        channels: usedChannels,
        pushEnabled: channels.push,
        targetArea: target === "Semua Wilayah" ? null : target,
      });

      setSent(true);
      await loadHistory();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t("adminAlerts.sendFailed"));
    }
  };

  const submitWithConfirm = (event: FormEvent) => {
    event.preventDefault();
    setConfirmBroadcastOpen(true);
  };

  const getTranslatedLevel = (lvl: AlertLevel) => {
    if (lvl === "Bahaya") return t("adminAlerts.levels.danger");
    if (lvl === "Waspada") return t("adminAlerts.levels.warning");
    return t("adminAlerts.levels.safe");
  };

  const getTranslatedTarget = (tgt: string) => {
    if (tgt === "Semua Wilayah") return t("adminAlerts.targets.all");
    return tgt;
  };

  return (
    <main className="space-y-6">
      {/* Header */}
      <Card className="relative overflow-hidden border-blue-500/10 bg-linear-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-xl">
        <div className="absolute -right-6 top-6 h-28 w-28 rounded-3xl border border-white/10 bg-white/5" />
        <div className="relative z-10 space-y-1.5 px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight">{t("adminAlerts.title")}</h1>
          <p className="max-w-2xl text-sm text-blue-50/95">{t("adminAlerts.subtitle")}</p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-slate-100 bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">{t("adminAlerts.totalBroadcast")}</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="rounded-lg bg-slate-50 p-2">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{history.length}</p>
              <p className="text-xs text-slate-500">{t("adminAlerts.totalBroadcastDesc")}</p>
            </div>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">{t("adminAlerts.currentLevel")}</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="rounded-lg p-2">
              {level === "Bahaya" ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : level === "Waspada" ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 9v4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="16" r="1"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </div>
            <div>
              <p className={`text-3xl font-bold ${level === "Bahaya" ? "text-rose-600" : level === "Waspada" ? "text-amber-600" : "text-emerald-600"}`}>{getTranslatedLevel(level)}</p>
              <p className="text-xs text-slate-500">{t("adminAlerts.currentLevelDesc")}</p>
            </div>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm text-slate-500">{t("adminAlerts.activeChannels")}</p>
          <div className="mt-2">
            <p className="text-3xl font-bold text-cyan-700">{Object.values(channels).filter(Boolean).length}</p>
            <p className="text-xs text-slate-500">{t("adminAlerts.activeChannelsDesc")}</p>
          </div>
        </Card>
      </div>

      {/* Form */}
      <Card className="border border-slate-100 bg-white rounded-xl shadow-md p-6">
        <h2 className="mb-3 text-base font-semibold text-slate-900">{t("adminAlerts.panelTitle")}</h2>
        <form onSubmit={submitWithConfirm} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block text-sm text-slate-700">
              {t("adminAlerts.targetLabel")}
              <select
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="Semua Wilayah">{t("adminAlerts.targets.all")}</option>
                <option value="Kecamatan Utara">{t("adminAlerts.targets.north")}</option>
                <option value="Kecamatan Tengah">{t("adminAlerts.targets.center")}</option>
                <option value="Kecamatan Hilir">{t("adminAlerts.targets.south")}</option>
              </select>
            </label>

            <label className="block text-sm text-slate-700 md:col-span-2">
              {t("adminAlerts.titleLabel")}
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block text-sm text-slate-700">
              {t("adminAlerts.levelLabel")}
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value as AlertLevel)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="Aman">{t("adminAlerts.levels.safe")}</option>
                <option value="Waspada">{t("adminAlerts.levels.warning")}</option>
                <option value="Bahaya">{t("adminAlerts.levels.danger")}</option>
              </select>
            </label>

            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-slate-700">{t("adminAlerts.channelLabel")}</p>
              <div className="flex flex-wrap gap-3">
                {/* Push pill */}
                <button
                  type="button"
                  onClick={() => toggleChannel("push")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-shadow ${channels.push ? 'bg-sky-50 border border-sky-200 shadow-sm text-sky-700' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v7l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Push
                </button>

                {/* Email pill */}
                <button
                  type="button"
                  onClick={() => toggleChannel("email")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-shadow ${channels.email ? 'bg-blue-50 border border-blue-200 shadow-sm text-blue-700' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8l9 6 9-6" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Email
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="mb-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => applyTemplate("evakuasi")} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium hover:bg-slate-200 transition">{t("adminAlerts.templateEvac")}</button>
              <button type="button" onClick={() => applyTemplate("waspada")} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium hover:bg-slate-200 transition">{t("adminAlerts.templateWarn")}</button>
            </div>

            <label className="block text-sm font-medium text-slate-700">{t("adminAlerts.messageLabel")}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 h-36 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-bold text-white tracking-wide shadow-md hover:bg-rose-700 hover:shadow-lg transition-all"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11h14M21 11v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {t("adminAlerts.broadcastBtn")}
            </button>
            {sent && <p className="text-sm text-emerald-600">{t("adminAlerts.broadcastSuccess")}</p>}
          </div>

          {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
        </form>
      </Card>

      {/* History table */}
      <Card className="border border-slate-100 bg-white rounded-xl shadow-md p-5">
        <h2 className="mb-3 text-base font-semibold text-slate-900">{t("adminAlerts.historyTitle")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 px-4">{t("adminAlerts.colDateTime")}</th>
                <th className="py-3 px-4">{t("adminAlerts.colLevel")}</th>
                <th className="py-3 px-4">{t("adminAlerts.colChannels")}</th>
                <th className="py-3 px-4">{t("adminAlerts.colSender")}</th>
                <th className="py-3 px-4">{t("adminAlerts.colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 text-slate-700">{formatTimestamp(item.sentAt, language)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.level === "Bahaya"
                          ? "bg-rose-100 text-rose-700"
                          : item.level === "Waspada"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {getTranslatedLevel(item.level)}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700">{item.channels.join(", ")}</td>
                  <td className="py-3 text-slate-700">{item.sender}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === "Berhasil" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.status === "Berhasil" ? t("adminAlerts.statusSuccess") : t("adminAlerts.statusFailed")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Custom Confirm Modal */}
      {confirmBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmBroadcastOpen(false)} />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-rose-100 p-2">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t("adminAlerts.confirmTitle")}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t("adminAlerts.confirmDesc")
                    .replace("{level}", getTranslatedLevel(level))
                    .replace("{target}", getTranslatedTarget(target))
                    .replace("{channels}", (Object.entries(channels) as Array<[Channel, boolean]>)
                      .filter(([, enabled]) => enabled)
                      .map(([key]) => CHANNEL_LABELS[key])
                      .join(', '))
                  }
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmBroadcastOpen(false)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{t("adminAlerts.confirmCancel")}</button>
              <button
                type="button"
                onClick={() => {
                  setConfirmBroadcastOpen(false);
                  void sendAlert();
                }}
                className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-bold text-white tracking-wide shadow-md hover:bg-rose-700 hover:shadow-lg transition-all"
              >
                {t("adminAlerts.confirmYes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
