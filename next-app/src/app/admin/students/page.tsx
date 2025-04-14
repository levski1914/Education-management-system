"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/app/utils/api";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  class?: {
    id: string;
    name: string;
  };
};

type Classroom = {
  id: string;
  name: string;
};

type EnhancedStudent = User & {
  hasWarnings?: boolean;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<EnhancedStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("ALL");
  const [search, setSearch] = useState("");
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/users?role=STUDENT", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const baseStudents: EnhancedStudent[] = res.data;

    // Добавяме warning status асинхронно
    const studentsWithWarnings = await Promise.all(
      baseStudents.map(async (s) => {
        const warningRes = await api.get(`/students/${s.id}/warnings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return { ...s, hasWarnings: warningRes.data.hasWarnings };
      })
    );

    setStudents(studentsWithWarnings);
  };

  const fetchClassrooms = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/classrooms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClassrooms(res.data);
  };
  useEffect(() => {
    fetchStudents();
    fetchClassrooms();
    const token = localStorage.getItem("token");
    api
      .get("/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClassrooms(res.data));
  }, []);
  const filteredStudents = students.filter((s) => {
    const matchesClass =
      selectedClassroom === "ALL" || s.class?.id === selectedClassroom;
    const matchesSearch =
      s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👦 Ученици</h1>
        <Link
          href="/admin/students/new"
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          ➕ Добави ученик
        </Link>
      </div>
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Търси по име, имейл..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-zinc-800 text-white border border-zinc-600"
        />

        <button
          className={`px-4 py-2 rounded ${
            selectedClassroom === "ALL" ? "bg-blue-600" : "bg-zinc-700"
          }`}
          onClick={() => setSelectedClassroom("ALL")}
        >
          Всички
        </button>

        {classrooms.map((cls) => (
          <button
            key={cls.id}
            className={`px-4 py-2 rounded text-sm ${
              selectedClassroom === cls.id ? "bg-blue-600" : "bg-zinc-700"
            }`}
            onClick={() => setSelectedClassroom(cls.id)}
          >
            {cls.name}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((s) => (
          <div
            key={s.id}
            className={`bg-zinc-800 p-4 rounded shadow space-y-2 flex flex-col justify-between ${
              s.hasWarnings ? "border-8 border-red-600 border-" : ""
            }`}
          >
            <div>
              <h3 className="font-semibold text-lg">
                {s.firstName} {s.lastName}
              </h3>
              {s.hasWarnings && (
                <p className="text-sm text-red-400 font-bold mt-1">
                  ⚠️ Внимание: Има чести отсъствия или закъснения
                </p>
              )}
              <p className="text-sm text-zinc-400">{s.email}</p>
              {s.class ? (
                <p className="text-sm mt-2">
                  📘 Назначен в клас:{" "}
                  <span className="text-green-400 font-bold text-base">
                    {s.class?.name}
                  </span>
                </p>
              ) : (
                <p className="text-sm mt-2 text-yellow-400">
                  ⚠️ Не е назначен в клас
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => {
                  setSelectedStudent(s);
                  setSelectedClassId(s.class?.id || "");
                }}
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
              >
                🧭 Назначи/Промени клас
              </button>

              <Link
                href={`/admin/students/${s.id}`}
                className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm"
              >
                📄 Досие
              </Link>

              <Link
                href={`/admin/students/${s.id}/edit`}
                className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
              >
                ✏️ Редакция
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
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
              >
                🗑️ Изтрий
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              Назначи в клас: {selectedStudent.firstName}{" "}
              {selectedStudent.lastName}
            </h2>

            <select
              className="w-full bg-zinc-700 text-white p-2 rounded"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Избери клас</option>
              {classrooms.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
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
                  await fetchStudents();
                  setSelectedStudent(null);
                }}
                disabled={!selectedClassId}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
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
