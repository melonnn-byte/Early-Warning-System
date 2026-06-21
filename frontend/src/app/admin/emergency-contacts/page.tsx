"use client";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

// ── Types ────────────────────────────────────────────────────────────────────
type EmergencyCategory = "BPBD" | "SAR" | "AMBULANCE" | "POLICE" | "HOSPITAL" | "OTHER";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: EmergencyCategory;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ContactFormState {
  name: string;
  phone: string;
  category: EmergencyCategory;
  isActive: boolean;
}

const emptyForm: ContactFormState = {
  name: "",
  phone: "",
  category: "BPBD",
  isActive: true,
};

const CATEGORY_COLORS: Record<EmergencyCategory, string> = {
  BPBD: "bg-blue-50 text-blue-700 border-blue-200",
  SAR: "bg-orange-50 text-orange-700 border-orange-200",
  AMBULANCE: "bg-rose-50 text-rose-700 border-rose-200",
  POLICE: "bg-violet-50 text-violet-700 border-violet-200",
  HOSPITAL: "bg-teal-50 text-teal-700 border-teal-200",
  OTHER: "bg-slate-50 text-slate-700 border-slate-200",
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return "";
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AdminEmergencyContactsPage() {
  const { t, language } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const getCategoryLabel = (cat: EmergencyCategory) => {
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

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/emergency-contacts/admin/all");
      setContacts((res.data?.data ?? res.data ?? []) as EmergencyContact[]);
    } catch (err) {
      setError(getErrorMessage(err) || t("adminEmergencyContacts.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  // Auto-dismiss banners
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(null), 5000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(null), 5000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      phone: contact.phone,
      category: contact.category,
      isActive: contact.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingId) {
        await api.patch(`/emergency-contacts/${editingId}`, form);
        setSuccessMsg(t("adminEmergencyContacts.saveSuccess"));
      } else {
        await api.post("/emergency-contacts", form);
        setSuccessMsg(t("adminEmergencyContacts.addSuccess"));
      }
      setModalOpen(false);
      void load();
    } catch (err) {
      setErrorMsg(getErrorMessage(err) || t("adminEmergencyContacts.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    try {
      await api.delete(`/emergency-contacts/${id}`);
      setSuccessMsg(t("adminEmergencyContacts.deleteSuccess"));
      void load();
    } catch (err) {
      setErrorMsg(getErrorMessage(err) || t("adminEmergencyContacts.deleteFailed"));
    }
  };

  const activeCount = contacts.filter((c) => c.isActive).length;
  const inactiveCount = contacts.length - activeCount;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <main className="space-y-6">
      {/* Header */}
      <Card className="overflow-hidden border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">Command Center</p>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("adminEmergencyContacts.title")}</h1>
              <p className="max-w-2xl text-sm text-slate-600">
                {t("adminEmergencyContacts.subtitle")}
              </p>
            </div>
          </div>
          <Button onClick={openCreate} className="bg-blue-600 text-white shadow-sm hover:bg-blue-700">
            {t("adminEmergencyContacts.addBtn")}
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border-slate-200/70 bg-white/80 p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("adminEmergencyContacts.totalContacts")}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{contacts.length}</p>
          <p className="text-xs text-slate-500">{t("adminEmergencyContacts.totalContactsDesc")}</p>
        </Card>
        <Card className="rounded-xl border-emerald-100 bg-emerald-50/60 p-4 shadow-sm">
          <p className="text-sm text-emerald-700">{t("adminEmergencyContacts.activeContacts")}</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{activeCount}</p>
          <p className="text-xs text-emerald-600">{t("adminEmergencyContacts.activeContactsDesc")}</p>
        </Card>
        <Card className="rounded-xl border-slate-200/70 bg-white/80 p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("adminEmergencyContacts.inactiveContacts")}</p>
          <p className="mt-1 text-3xl font-bold text-slate-500">{inactiveCount}</p>
          <p className="text-xs text-slate-500">{t("adminEmergencyContacts.inactiveContactsDesc")}</p>
        </Card>
      </div>

      {/* Banners */}
      {successMsg && (
        <Card className="border-emerald-200 bg-emerald-50/80 py-3 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">{successMsg}</p>
        </Card>
      )}
      {errorMsg && (
        <Card className="border-rose-200 bg-rose-50/80 py-3 shadow-sm">
          <p className="text-sm font-medium text-rose-700">{errorMsg}</p>
        </Card>
      )}

      {/* Table */}
      {isLoading ? (
        <Card className="border-slate-200 bg-white/80 p-0 shadow-sm">
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-5">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="ml-auto h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card className="border-rose-200 bg-rose-50/80 shadow-sm">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <Button onClick={() => void load()} className="mt-3 bg-white text-rose-700 hover:bg-rose-50">
            {t("adminEmergencyContacts.retryBtn")}
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden border-slate-200/70 bg-white/80 p-0 shadow-sm backdrop-blur-xl">
          <div className="hidden grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
            <div>{t("adminEmergencyContacts.colName")}</div>
            <div>{t("adminEmergencyContacts.colPhone")}</div>
            <div>{t("adminEmergencyContacts.colCategory")}</div>
            <div>{t("adminEmergencyContacts.colStatus")}</div>
            <div className="text-right">{t("adminEmergencyContacts.colAction")}</div>
          </div>

          {contacts.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              {t("adminEmergencyContacts.emptyContacts")}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="grid items-center gap-4 px-5 py-4 md:grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr]"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{contact.name}</p>
                  </div>

                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-800">{contact.phone}</p>
                  </div>

                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        CATEGORY_COLORS[contact.category],
                      )}
                    >
                      {getCategoryLabel(contact.category)}
                    </span>
                  </div>

                  <div>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        contact.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {contact.isActive ? t("adminEmergencyContacts.statusActive") : t("adminEmergencyContacts.statusInactive")}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(contact)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M14 4l6 6-10 10H4v-6L14 4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ id: contact.id, name: contact.name })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M7 7l1 13h8l1-13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Modal – Create / Edit */}
      <Modal
        open={modalOpen}
        title={editingId ? t("adminEmergencyContacts.editTitle") : t("adminEmergencyContacts.addTitle")}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
              <p className="font-semibold">{t("adminEmergencyContacts.saveFailed")}</p>
              <p className="mt-1 text-xs">{errorMsg}</p>
            </div>
          )}

          <label className="block text-sm font-medium text-slate-700">
            {t("adminEmergencyContacts.fieldName")}
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={t("adminEmergencyContacts.fieldNamePlaceholder")}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            {t("adminEmergencyContacts.fieldPhone")}
            <input
              required
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono focus:border-blue-500 focus:outline-none"
              placeholder={t("adminEmergencyContacts.fieldPhonePlaceholder")}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              {t("adminEmergencyContacts.fieldCategory")}
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as EmergencyCategory }))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                {(Object.keys(CATEGORY_COLORS) as EmergencyCategory[]).map((val) => (
                  <option key={val} value={val}>{getCategoryLabel(val)}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("adminEmergencyContacts.fieldStatus")}
              <select
                value={form.isActive ? "true" : "false"}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === "true" }))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="true">{t("adminEmergencyContacts.statusActivePub")}</option>
                <option value="false">{t("adminEmergencyContacts.statusInactiveHidden")}</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
              {t("adminEmergencyContacts.deleteConfirmCancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("adminSensors.savingLoader") : t("adminSensors.saveSensorBtn")}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title={t("adminEmergencyContacts.deleteConfirmTitle")}
        description={t("adminEmergencyContacts.deleteConfirmDesc").replace("{name}", deleteConfirm?.name ?? "")}
        confirmText={t("adminEmergencyContacts.deleteConfirmYes")}
        cancelText={t("adminEmergencyContacts.deleteConfirmCancel")}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          const selected = deleteConfirm;
          setDeleteConfirm(null);
          if (selected) void handleDelete(selected.id);
        }}
      />
    </main>
  );
}
