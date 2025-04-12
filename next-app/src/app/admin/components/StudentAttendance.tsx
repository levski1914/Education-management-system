"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

type AttendanceRecord = {
  id: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  createdAt: string;
  lesson: {
    subject: { name: string };
    teacher: { firstName: string; lastName: string };
  };
};

export function StudentAttendance({ studentId }: { studentId: string }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get(`/students/${studentId}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAttendance(res.data));
  }, [studentId]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Присъствия</h2>
      {attendance.length === 0 ? (
        <p>Няма данни</p>
      ) : (
        <table className="w-full text-sm border-collapse border border-zinc-700">
          <thead>
            <tr className="bg-zinc-800 text-white">
              <th className="border border-zinc-700 px-2 py-1">Дата</th>
              <th className="border border-zinc-700 px-2 py-1">Предмет</th>
              <th className="border border-zinc-700 px-2 py-1">Учител</th>
              <th className="border border-zinc-700 px-2 py-1">Статус</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td className="border border-zinc-700 px-2 py-1">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-zinc-700 px-2 py-1">
                  {a.lesson.subject.name}
                </td>
                <td className="border border-zinc-700 px-2 py-1">
                  {a.lesson.teacher.firstName} {a.lesson.teacher.lastName}
                </td>
                <td className="border border-zinc-700 px-2 py-1 font-bold text-center">
                  {a.status === "PRESENT" && "✔️ Присъствал"}
                  {a.status === "ABSENT" && "❌ Отсъствие"}
                  {a.status === "LATE" && "⏱️ Закъснял"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
