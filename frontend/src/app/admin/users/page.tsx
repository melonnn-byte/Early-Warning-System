"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { AppUser, UserRole } from "@/types/user";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";

interface UserFormState {
  name: string;
  email: string;
  whatsappNumber: string;
  password: string;
  role: UserRole;
  institution: string;
}

const emptyUserForm: UserFormState = {
  name: "",
  email: "",
  whatsappNumber: "",
  password: "",
  role: "user",
  institution: "",
};

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  institution?: string | null;
  role: "ADMIN" | "USER" | string;
}

function mapRole(role: ApiUser["role"]): UserRole {
  const normalized = role.toUpperCase();
  if (normalized === "ADMIN") {
    return "admin";
  }
  return "user";
}

function toApiRole(role: UserRole): "ADMIN" | "USER" {
  return role === "admin" ? "ADMIN" : "USER";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyUserForm);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const loadUsers = async () => {
    setErrorMessage(null);
    try {
      const response = await api.get("/users");
      const rows = (response.data?.data ?? []) as ApiUser[];
      setUsers(
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          whatsappNumber: row.phone ?? "",
          institution: row.institution ?? null,
          role: mapRole(row.role),
        })),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const adminCount = useMemo(() => users.filter((user) => user.role === "admin").length, [users]);
  const userCount = useMemo(() => users.filter((user) => user.role === "user").length, [users]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyUserForm);
    setErrorMessage(null);
    setOpen(true);
  };

  const openEdit = (user: AppUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      whatsappNumber: user.whatsappNumber ?? "",
      password: "",
      role: user.role,
      institution: user.institution ?? "",
    });
    setErrorMessage(null);
    setOpen(true);
  };

  const deleteUser = async (id: string) => {
    setSavedMessage(null);
    setErrorMessage(null);
    try {
      await api.delete(`/users/${id}`);
      setSavedMessage("Pengguna berhasil dihapus.");
      await loadUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus pengguna.");
    }
  };

  const submitUser = async (event: FormEvent) => {
    event.preventDefault();
    setSavedMessage(null);
    setErrorMessage(null);

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, {
          name: form.name,
          email: form.email,
          phone: form.whatsappNumber,
          institution: form.institution,
          role: toApiRole(form.role),
          ...(form.password ? { password: form.password } : {}),
        });
        setSavedMessage("Pengguna berhasil diperbarui.");
      } else {
        await api.post("/users", {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.whatsappNumber,
          institution: form.institution,
          role: toApiRole(form.role),
        });
        setSavedMessage("Pengguna baru berhasil ditambahkan.");
      }

      setOpen(false);
      await loadUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan data pengguna.");
    }
  };

  return (
    <main className="space-y-6">
      <Card className="relative overflow-hidden border-blue-500/30 bg-linear-to-r from-blue-600 via-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/20">
        <div className="absolute -right-2 top-4 h-24 w-24 rounded-3xl border border-white/20 bg-white/10" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
            <p className="max-w-2xl text-sm text-blue-50/95">Kelola akses akun admin dan user dengan role-based access control (RBAC).</p>
          </div>
          <Button onClick={openCreate} className="bg-white text-blue-700 hover:bg-blue-50">
            Tambah User
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Total Pengguna</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{users.length}</p>
          <p className="text-xs text-slate-500">Akun terdaftar dalam sistem</p>
        </Card>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Role Admin</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{adminCount}</p>
          <p className="text-xs text-slate-500">Akses penuh sistem</p>
        </Card>
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <p className="text-sm text-slate-500">Role User</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{userCount}</p>
          <p className="text-xs text-slate-500">Akses dashboard pengguna</p>
        </Card>
      </div>

      {loading && <p className="text-sm text-slate-500">Memuat data pengguna...</p>}
      {savedMessage && <p className="text-sm font-medium text-emerald-600">{savedMessage}</p>}
      {errorMessage && <p className="text-sm font-medium text-rose-600">{errorMessage}</p>}

      <Card className="overflow-x-auto border-slate-200 bg-white/95 shadow-md shadow-slate-200/40">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Daftar Pengguna</h2>
            <p className="text-sm text-slate-500">Kelola role dan informasi akun petugas.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Total {users.length} User</span>
        </div>
        <table className="w-full min-w-180 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Nama</th>
              <th className="py-2">Email</th>
              <th className="py-2">Nomor WhatsApp</th>
              <th className="py-2">Role</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">{user.whatsappNumber ?? "-"}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteConfirm({ id: user.id, name: user.name })}>
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} title={editingId ? "Edit User" : "Tambah User"} onClose={() => setOpen(false)}>
        <form onSubmit={submitUser} className="space-y-3">
          <label className="block text-sm text-slate-700">
            Nama Lengkap
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Nomor WhatsApp
            <input
              required
              value={form.whatsappNumber}
              onChange={(event) => setForm((prev) => ({ ...prev, whatsappNumber: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="62812xxxxxxx"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Password
            <input
              type="password"
              required={!editingId}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder={editingId ? "Kosongkan jika tidak diubah" : "Masukkan password"}
            />
            <p className="mt-1 text-xs text-slate-500">Password akan di-enkripsi menggunakan bcrypt di backend Nest.js.</p>
          </label>

          <label className="block text-sm text-slate-700">
            Instansi
            <input
              value={form.institution}
              onChange={(event) => setForm((prev) => ({ ...prev, institution: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Contoh: BPBD Kota"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Pilih Role
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Hak Akses:</p>
            <p>Admin: akses penuh, termasuk threshold, hapus data, dan kelola pengguna.</p>
            <p>User: memantau dashboard pengguna, notifikasi, dan informasi darurat.</p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan User</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title="Hapus pengguna ini?"
        description={`Data akun ${deleteConfirm?.name ?? "pengguna"} akan dihapus dari sistem.`}
        confirmText="Ya, hapus"
        cancelText="Batal"
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          const selected = deleteConfirm;
          setDeleteConfirm(null);
          if (selected) {
            void deleteUser(selected.id);
          }
        }}
      />
    </main>
  );
}
