"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

const days = ["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък"];

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState<any[]>([]);

  const fetchSchedule = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/teacher/my-schedule", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSchedule(res.data);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const grouped = schedule.reduce((acc: any, lesson: any) => {
    const day = lesson.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(lesson);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🕒 Моето разписание</h1>
      {days.map((day, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{day}</h2>
          <div className="space-y-2">
            {(grouped[index] || []).map((lesson: any) => (
              <div
                key={lesson.id}
                className="bg-white p-3 border rounded shadow"
              >
                <p className="text-sm text-gray-700">
                  🧠 {lesson.subject?.name} | 📚 {lesson.classroom.grade}
                  {lesson.classroom.letter} клас
                </p>
                <p className="text-xs text-gray-500">
                  ⏰ {lesson.startTime} – {lesson.endTime}
                </p>
              </div>
            ))}
            {(grouped[index] || []).length === 0 && (
              <p className="text-sm text-gray-400 italic">
                Няма занятия за този ден
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
