"use client";
import React, { useEffect, useState } from "react";
import ParentPanel from "../layout";
import { api } from "@/app/utils/api";
type Lesson = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject: {
    name: string;
  };
  teacher: {
    firstName: string;
    lastName: string;
  };
};
type Summary = {
  avgGrade: number;
  totalAbsences: number;
  totalWarnings: number;
};
type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

const ParentDashboard = () => {
  const [schedule, setSchedule] = useState<Lesson[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    const fetchChildAndData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const children = res.data.children || [];
        if (children.length === 0) {
          console.warn("Родителят няма свързани ученици.");
          setLoading(false);
          return;
        }
        setStudents(res.data.children || null);
        const student = children[0];
        setStudentId(student.id);

        const [schRes, sumRes] = await Promise.all([
          api.get(`/users/${student.id}/schedule`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/users/${student.id}/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSchedule(schRes.data);
        setSummary(sumRes.data);
      } catch (error) {
        console.error("Грешка при зареждане на начална страница", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildAndData();
  }, []);
  const days = ["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък"];

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">👋 Добре дошли, Родителю</h2>

        {loading ? (
          <p>Зареждане...</p>
        ) : studentId === null ? (
          <p>❗ Нямате свързани ученици.</p>
        ) : (
          <>
            {/* 📊 Обобщение */}
            {students.map((student) => (
              <div key={student.id} className="br">
                <h2 className="text-3xl mb-5">
                  {student.firstName} {student.lastName}
                </h2>
              </div>
            ))}
            <div className="grid grid-cols-1 text-black md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">📚 Среден успех</h3>
                <p className="text-2xl text-green-700">
                  {summary?.avgGrade?.toFixed(2) || "—"}
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">📅 Отсъствия</h3>
                <p className="text-2xl text-red-700">
                  {summary?.totalAbsences || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">⚠️ Забележки</h3>
                <p className="text-2xl text-yellow-600">
                  {summary?.totalWarnings || 0}
                </p>
              </div>
            </div>

            {/* 📆 Разписание */}
            <div className="bg-white p-4 text-black rounded shadow">
              <h3 className="text-xl font-bold mb-4">🕒 Седмично разписание</h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-sm">
                  <thead>
                    <tr>
                      <th className="border p-2">Ден</th>
                      <th className="border p-2">Час</th>
                      <th className="border p-2">Предмет</th>
                      <th className="border p-2">Учител</th>
                      <th className="border p-2">От - До</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((lesson, index) => (
                      <tr key={index}>
                        <td className="border p-2">{days[lesson.dayOfWeek]}</td>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{lesson.subject.name}</td>
                        <td className="border p-2">
                          {lesson.teacher.firstName} {lesson.teacher.lastName}
                        </td>
                        <td className="border p-2">
                          {lesson.startTime} - {lesson.endTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ParentDashboard;
