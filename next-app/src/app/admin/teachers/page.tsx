"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import Link from "next/link";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = () => {
    const token = localStorage.getItem("token");
    api
      .get("/users?role=TEACHER", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTeachers(res.data))
      .catch((err) =>
        console.error("❌ Error loading teachers", err.response?.data)
      );
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (confirm("Сигурен ли си, че искаш да изтриеш учителя?")) {
      try {
        await api.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTeachers(); // презареждане
      } catch (err: any) {
        alert(err.response?.data?.message || "❌ Грешка при изтриване");
      }
    }
  };

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">👨‍🏫 Учители</h1>
        <Link
          href="/admin/teachers/new"
          className="bg-green-600 px-4 py-2 rounded"
        >
          ➕ Добави учител
        </Link>
      </div>

      <div className="grid gap-4">
        {teachers.map((t: any) => (
          <div
            key={t.id}
            className="bg-zinc-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {t.firstName} {t.lastName}
              </p>
              <p className="text-zinc-400 text-sm">{t.email}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/teachers/${t.id}/edit`}
                className="bg-blue-600 px-2 py-1 rounded text-sm"
              >
                ✏️
              </Link>
              <button
                onClick={() => handleDelete(t.id)}
                className="bg-red-600 px-2 py-1 rounded text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
