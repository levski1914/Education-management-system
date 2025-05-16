"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/utils/api";
import TeacherLessonModal from "./TeacherLesson";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isCurrentLesson, setIsCurrentLesson] = useState(false);

  const [upcomingLesson, setUpcomingLesson] = useState<any>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingLesson(); // 🆕
    fetchClasses();
  }, []);
  const fetchClasses = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await api.get("/teacher/my-classes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoading(false);
    setClasses(res.data);
  };

  const fetchUpcomingLesson = async () => {
    setLoading(true); // ⏳ Започваме зареждането

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const res = await api.get("/teacher/my-schedule", { headers });

    const now = new Date();
    const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
    const today = now.getDay(); // 0 = Sunday
    const adjustedToday = today === 0 ? 7 : today;

    const todayLessons = res.data.filter(
      (l: any) => l.dayOfWeek === adjustedToday
    );
    let currentLesson: any = null;
    let nextLesson: any = null;

    for (const lesson of todayLessons) {
      const [startH, startM] = lesson.startTime.split(":").map(Number);
      const [endH, endM] = lesson.endTime.split(":").map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (nowTotalMinutes >= startMinutes && nowTotalMinutes <= endMinutes) {
        currentLesson = lesson;
        break;
      } else if (startMinutes > nowTotalMinutes && !nextLesson) {
        nextLesson = lesson;
      }
      console.log("fetch: ", loading);
      setLoading(false);
    }

    const lessonToShow = currentLesson || nextLesson;

    if (lessonToShow) {
      const [subjectRes, classroomRes] = await Promise.all([
        api.get(`/subjects/${lessonToShow.subjectId}`, { headers }),
        api.get(`/classrooms/${lessonToShow.classroomId}`, { headers }),
      ]);

      setUpcomingLesson({
        ...lessonToShow,
        subject: subjectRes.data,
        classroom: classroomRes.data,
      });
    } else {
      setUpcomingLesson(null);
    }
    setIsCurrentLesson(!!currentLesson);

    // console.log("📆 Today:", adjustedToday);
    // console.log("🕓 Now:", nowTotalMinutes);
    // console.log("📚 Selected lesson:", currentLesson ? "Текущ" : "Следващ", lessonToShow);
  };

  if (loading) {
    console.log(loading);
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📘 Моите класове</h1>
      {!upcomingLesson && (
        <p className="text-md border border-black  text-gray-200 p-2  my-2 italic">
          Няма занятия за този ден
        </p>
      )}
      {upcomingLesson && (
        <div className="border border-blue-500 bg-blue-50 p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {isCurrentLesson ? "⏰ Текущ час" : "📢 Предстоящ час след малко"}
          </h2>

          <p>
            🕒 {upcomingLesson.startTime} – {upcomingLesson.endTime}
          </p>
          <p>
            📘 {upcomingLesson.subject.name} – {upcomingLesson.classroom.grade}
            {upcomingLesson.classroom.letter} клас
          </p>
          <button
            onClick={() => setShowLessonModal(true)}
            className="mt-2 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ▶️ Стартирай час
          </button>
        </div>
      )}
      {showLessonModal && upcomingLesson && (
        <TeacherLessonModal
          lesson={upcomingLesson}
          onClose={() => setShowLessonModal(false)}
        />
      )}
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
