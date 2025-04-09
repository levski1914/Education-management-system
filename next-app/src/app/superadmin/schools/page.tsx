"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import Link from "next/link";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/schools", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSchools(res.data));
  }, []);
  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🏫 Училища</h1>
      <Link
        href="/superadmin/schools/new"
        className="text-green-400 hover:underline"
      >
        ➕ Добави ново училище
      </Link>
      <input
        type="text"
        placeholder="Търси по име или град..."
        className="mb-4 p-2 w-full rounded bg-zinc-800 border border-zinc-700 text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-4 bg-zinc-800 rounded-xl shadow hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-lg font-bold">{s.name}</h2>
            <p className="text-zinc-400">{s.city}</p>
            <button
              onClick={() => setSelected(s)}
              className="mt-2 text-blue-400 hover:underline"
            >
              Преглед
            </button>
            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                await api.delete(`/schools/${s.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setSchools(schools.filter((sch) => sch.id !== s.id));
              }}
              className="bg-red-600 px-3 py-1 rounded text-white"
            >
              Изтрий
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-lg w-full text-white relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-4 text-zinc-400 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-2">{selected.name}</h2>
            <p className="mb-4 text-zinc-400">📍 Град: {selected.city}</p>
            <p className="mb-2">👨‍🏫 Учители: ??</p>
            <p className="mb-2">👨‍🎓 Ученици: ??</p>
            <p className="mb-2">👨‍👩‍👧 Родители: ??</p>
            <p className="mb-2">🧑‍💼 Директори: ??</p>
            <button className="mt-4 bg-blue-600 px-4 py-2 rounded">
              Отиди към училището
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
