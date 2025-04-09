"use client";
import { useState, useEffect } from "react";
import { api } from "@/app/utils/api";
import Link from "next/link";

export default function StudentPage() {
  const [students, setStudents] = useState<
    { id: string; email: string; egn?: string }[]
  >([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/users?role=STUDENT", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudents(res.data));
  }, []);
  const filtered = students.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.egn?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👨‍🎓 Ученици</h1>

      <Link
        href="/superadmin/students/new"
        className="bg-green-600 text-white px-4 py-2 rounded inline-block mb-4"
      >
        ➕ Добави ученик
      </Link>
      <input
        type="text"
        placeholder="Търси по име или град..."
        className="mb-4 p-2 w-full rounded bg-zinc-800 border border-zinc-700 text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s: any) => (
          <li
            key={s.id}
            className="p-4 bg-zinc-800 rounded flex justify-between items-center"
          >
            <div>
              <strong>{s.email}</strong>
              <p className="text-zinc-400">ЕГН: {s.egn || "–"}</p>
            </div>
            <div className="space-x-2">
              <Link
                href={`/superadmin/students/${s.id}/edit`}
                className="bg-blue-600 px-3 py-1 rounded text-white"
              >
                ✏️
              </Link>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  await api.delete(`/users/${s.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setStudents(students.filter((st) => st.id !== s.id));
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
