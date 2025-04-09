"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import Link from "next/link";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/users?role=TEACHER", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTeachers(res.data))
      .catch((err) =>
        console.error("❌ Error loading teachers", err.response?.data)
      );
  }, []);

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👨‍🏫 Учители</h1>
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
            className="bg-zinc-800 p-4 rounded shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">
                {t.firstName} {t.lastName}
              </p>
              <p className="text-zinc-400 text-sm">{t.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
