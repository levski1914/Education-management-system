"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import Link from "next/link";
import ParentHistory from "../components/ParentHistory";

export default function ParentsPage() {
  const [parents, setParents] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [editingParent, setEditingParent] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const fetchParents = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/users?role=PARENT", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setParents(res.data);
  };
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/users?role=STUDENT", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchParents();
  }, []);

  const createParent = async () => {
    if (editingParent) {
      await updateParent();
      return;
    }
    const token = localStorage.getItem("token");
    await api.post(
      "/users",
      {
        email,
        password, // можеш да го подобриш по-късно
        role: "PARENT",
        firstName,
        lastName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setShowModal(false);
    fetchParents(); // презареди
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };
  const assignChild = async (parentId: string, studentId: string) => {
    const token = localStorage.getItem("token");
    await api.put(
      `/users/${parentId}/assign-child/${studentId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchParents();
  };
  const deleteParent = async (id: string) => {
    const token = localStorage.getItem("token");
    await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchParents();
  };
  const startEdit = (parent: any) => {
    setEditingParent(parent);
    setEmail(parent.email);
    setFirstName(parent.firstName || "");
    setLastName(parent.lastName || "");
    setShowModal(true);
  };

  const updateParent = async () => {
    const token = localStorage.getItem("token");
    await api.patch(
      `/users/${editingParent.id}`,
      { email, firstName, lastName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShowModal(false);
    setEditingParent(null);
    fetchParents();
  };

  const filteredStudents = parents.filter((s) => {
    const matchesSearch =
      s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👨‍👩‍👧‍👦 Родители</h1>
      <button
        onClick={() => setShowModal(true)}
        className="hover:bg-green-300 cursor-pointer bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Добави родител
      </button>
      <input
        type="text"
        placeholder="🔍 Търси по име, имейл..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded bg-zinc-800 text-white border border-zinc-600"
      />

      <div className="grid grid-cols-2 gap-4">
        {filteredStudents.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded shadow p-4 border space-y-2"
          >
            <div className="font-semibold text-lg">
              {p.firstName} {p.lastName}
            </div>
            <div className="text-sm text-gray-600">{p.email}</div>
            {p.children && p.children.length > 0 && (
              <div className="text-sm text-green-700">
                👶 Деца:
                <ul className="list-disc ml-4">
                  {p.children.map((c: any) => (
                    <li key={c.id}>
                      {c.firstName} {c.lastName}
                      <button
                        className="ml-2 text-red-600 underline text-xs"
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          await api.put(
                            `/users/${c.id}/unassign-parent`,
                            {},
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          fetchParents();
                          fetchStudents(); // 🔁 презареди и учениците
                        }}
                      >
                        ⛔ Премахни
                      </button>
                      <Link
                        href={`/admin/students/${c.id}`}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-sm"
                      >
                        📄 Досие
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Свържи с дете */}
            <div>
              <label className="block text-sm font-semibold">
                Свържи с дете:
              </label>
              <select
                className="mt-1 border rounded p-1 text-sm"
                onChange={(e) => assignChild(p.id, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Избери ученик
                </option>
                {students
                  .filter((s) => !s.parentId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
              </select>
            </div>
            {/* История за деца */}
            {p.children.map((child: any) => (
              <ParentHistory key={child.id} studentId={child.id} />
            ))}

            {/* Действия */}
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 px-3 py-1 rounded text-white text-sm"
                onClick={() => startEdit(p)}
              >
                Редакция
              </button>
              <button
                className="bg-red-600 px-3 py-1 rounded text-white text-sm"
                onClick={() => deleteParent(p.id)}
              >
                Изтрий
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingParent ? "Редакция на родител" : "Добави нов родител"}
            </h2>

            <input
              placeholder="Имейл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="password"
              placeholder="Парола"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <input
              placeholder="Име"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <input
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-between">
              <button
                className="bg-gray-500 hover:bg-gray-300 cursor-pointer text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Затвори
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-300 cursor-pointer text-white px-4 py-2 rounded"
                onClick={createParent}
              >
                Запази
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
