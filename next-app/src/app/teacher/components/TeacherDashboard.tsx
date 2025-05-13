"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);

  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/teacher/my-classes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClasses(res.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📘 Моите класове</h1>
      {classes.length === 0 && <p>Нямате назначени класове.</p>}

      <div className="space-y-4">
        {classes.map((c) => (
          <div
            key={c.id}
            className="border p-4 rounded shadow bg-white hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-1">
              {c.grade}
              {c.letter} клас
            </h2>
            <p>🏫 Училище: {c.school?.name}</p>
            <p>👨‍🎓 Ученици: {c.students?.length}</p>
            <a
              href={`/teacher/class/${c.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              ➡️ Виж учениците
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
