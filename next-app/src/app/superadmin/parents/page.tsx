"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/app/utils/api";

export default function ParentsPage() {
  const [parents, setParents] = useState<{ id: string; email: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/users?role=PARENT", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setParents(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👨‍👩‍👧‍👦 Родители</h1>

      <Link
        href="/superadmin/parents/new"
        className="bg-green-600 text-white px-4 py-2 rounded inline-block mb-4"
      >
        ➕ Добави родител
      </Link>

      <ul className="space-y-2">
        {parents.map((p: any) => (
          <li
            key={p.id}
            className="p-4 bg-zinc-800 rounded flex justify-between items-center"
          >
            <div>
              <strong>{p.email}</strong>
            </div>
            <div className="space-x-2">
              <Link
                href={`/superadmin/parents/${p.id}/edit`}
                className="bg-blue-600 px-3 py-1 rounded text-white"
              >
                ✏️
              </Link>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  await api.delete(`/users/${p.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setParents(parents.filter((user) => user.id !== p.id));
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
