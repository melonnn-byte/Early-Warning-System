"use client";

import { FormEvent, useState } from "react";
import type { AppUser, UserRole } from "@/types/user";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { mockUsers } from "@/constants";

interface UserFormState {
  name: string;
  email: string;
  whatsappNumber: string;
  password: string;
  role: UserRole;
}

const emptyUserForm: UserFormState = {
  name: "",
  email: "",
  whatsappNumber: "",
  password: "",
  role: "operator",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyUserForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyUserForm);
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
    });
    setOpen(true);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setSavedMessage("Pengguna berhasil dihapus.");
  };

  const submitUser = (event: FormEvent) => {
    event.preventDefault();

    const nextUser: AppUser = {
      id: editingId ?? `USR-${String(users.length + 1).padStart(2, "0")}`,
      name: form.name,
      email: form.email,
      whatsappNumber: form.whatsappNumber,
      role: form.role,
    };

    setUsers((prev) => (editingId ? prev.map((user) => (user.id === editingId ? nextUser : user)) : [nextUser, ...prev]));
    setSavedMessage(
      editingId
        ? "Pengguna berhasil diperbarui. Password baru akan di-hash bcrypt di backend Nest.js."
        : "Pengguna baru berhasil ditambahkan. Password akan di-hash bcrypt di backend Nest.js.",
    );
    setOpen(false);
  };

  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500">Kelola akses petugas dengan role-based access control (RBAC).</p>
        </div>
        <Button onClick={openCreate}>Tambah User</Button>
      </div>

      {savedMessage && <p className="text-sm font-medium text-emerald-600">{savedMessage}</p>}

      <Card className="overflow-x-auto">
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
                    {user.role === "admin" ? "Admin" : "Operator"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => deleteUser(user.id)}>
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
            Pilih Role
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Hak Akses:</p>
            <p>Admin: akses penuh, termasuk threshold, hapus data, dan kelola pengguna.</p>
            <p>Operator: memantau dashboard, kirim peringatan manual, dan unduh laporan bulanan.</p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan User</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
