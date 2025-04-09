"use client";
import { useState, useEffect } from "react";

import { api } from "@/app/utils/api";
import Link from "next/link";

export default function TeachersPage() {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState<{ id: string; email: string }[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/users?role=TEACHER", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTeachers(res.data));
  }, []);
  const filtered = teachers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👨‍🏫 Учители</h1>

      <Link
        href="/superadmin/teachers/new"
        className="bg-green-600 text-white px-4 py-2 rounded inline-block mb-4"
      >
        ➕ Добави учител
      </Link>
      <input
        type="text"
        placeholder="Търси по име или град..."
        className="mb-4 p-2 w-full rounded bg-zinc-800 border border-zinc-700 text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="space-y-2">
        {filtered.map((t: any) => (
          <li
            key={t.id}
            className="p-4 bg-zinc-800 rounded flex justify-between items-center"
          >
            <div>
              <strong>{t.email}</strong>
              <p className="text-zinc-400">ID: {t.id}</p>
            </div>
            <div className="space-x-2">
              <Link
                href={`/superadmin/teachers/${t.id}/edit`}
                className="bg-blue-600 px-3 py-1 rounded text-white"
              >
                ✏️
              </Link>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  await api.delete(`/users/${t.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setTeachers(teachers.filter((user) => user.id !== t.id));
                }}
                className="bg-red-600 px-3 py-1 rounded text-white"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
