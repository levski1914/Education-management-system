"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/app/utils/api";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  classroom?: {
    id: string;
    name: string;
  };
};

type Classroom = {
  id: string;
  name: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/users?role=STUDENT", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("📦 Ученици:", res.data);

    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();

    const token = localStorage.getItem("token");
    api
      .get("/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClassrooms(res.data));
  }, []);

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👦 Ученици</h1>
        <Link
          href="/admin/students/new"
          className="bg-green-600 px-4 py-2 rounded"
        >
          ➕ Добави ученик
        </Link>
      </div>

      <div className="grid gap-4">
        {students.map((s) => (
          <div
            key={s.id}
            className="bg-zinc-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">
                {s.firstName} {s.lastName}
              </div>
              <div className="text-sm text-zinc-400">{s.email}</div>
            </div>

            <div className="flex gap-2 items-center">
              {s.classroom ? (
                <>
                  <span className="text-sm text-green-400">
                    📘 Назначен в: {s.classroom.name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedStudent(s);
                      setSelectedClassId(s.classroom?.id || "");
                    }}
                    className="bg-yellow-600 px-3 py-1 rounded text-sm"
                  >
                    Промени
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedStudent(s)}
                  className="bg-blue-600 px-3 py-1 rounded text-sm"
                >
                  📌 Назначи в клас
                </button>
              )}

              <Link
                href={`/admin/students/${s.id}/`}
                className="bg-purple-600 px-3 py-1 rounded text-sm"
              >
                📄 Досие
              </Link>

              <Link
                href={`/admin/students/${s.id}/edit`}
                className="bg-blue-600 px-3 py-1 rounded text-sm"
              >
                ✏️
              </Link>

              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  if (confirm("Сигурен ли си, че искаш да изтриеш ученика?")) {
                    try {
                      await api.delete(`/users/${s.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      fetchStudents();
                    } catch (err: any) {
                      alert(
                        err.response?.data?.message || "Грешка при изтриване"
                      );
                    }
                  }
                }}
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 text-white  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              Назначаване: {selectedStudent.firstName}{" "}
              {selectedStudent.lastName}
            </h2>

            <select
              className="w-full bg-zinc-700 text-white p-2 rounded"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Избери клас</option>
              {classrooms.map((cls: any) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Затвори
              </button>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  await api.put(
                    `/classrooms/${selectedClassId}/assign-student/${selectedStudent.id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  await fetchStudents(); // тук е ключът 🗝️
                  setSelectedStudent(null);
                }}
                disabled={!selectedClassId}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Назначи
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
