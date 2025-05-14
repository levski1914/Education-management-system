"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/utils/api";
import TeacherLessonModal from "./TeacherLesson";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isCurrentLesson, setIsCurrentLesson] = useState(false);

  const [upcomingLesson, setUpcomingLesson] = useState<any>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  useEffect(() => {
    fetchUpcomingLesson(); // 🆕
    fetchClasses();
  }, []);
  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/teacher/my-classes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClasses(res.data);
  };

  const fetchUpcomingLesson = async () => {
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

  if (!upcomingLesson) {
    return (
      <svg
        className="pencil"
        viewBox="0 0 200 200"
        width="200px"
        height="200px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="pencil-eraser">
            <rect rx="5" ry="5" width="30" height="30"></rect>
          </clipPath>
        </defs>
        <circle
          className="pencil__stroke"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="439.82 439.82"
          strokeDashoffset="439.82"
          strokeLinecap="round"
          transform="rotate(-113,100,100)"
        ></circle>
        <g className="pencil__rotate" transform="translate(100,100)">
          <g fill="none">
            <circle
              className="pencil__body1"
              r="64"
              stroke="hsl(30, 30%, 50%)"
              strokeWidth="30"
              strokeDasharray="402.12 402.12"
              strokeDashoffset="402"
              transform="rotate(-90)"
            ></circle>
            <circle
              className="pencil__body2"
              r="74"
              stroke="hsl(30, 30%, 60%)"
              strokeWidth="10"
              strokeDasharray="464.96 464.96"
              strokeDashoffset="465"
              transform="rotate(-90)"
            ></circle>
            <circle
              className="pencil__body3"
              r="54"
              stroke="hsl(30, 30%, 40%)"
              strokeWidth="10"
              strokeDasharray="339.29 339.29"
              strokeDashoffset="339"
              transform="rotate(-90)"
            ></circle>
          </g>
          <g className="pencil__eraser" transform="rotate(-90) translate(49,0)">
            <g className="pencil__eraser-skew">
              <rect
                fill="hsl(30, 20%, 90%)"
                rx="5"
                ry="5"
                width="30"
                height="30"
              ></rect>
              <rect
                fill="hsl(30, 20%, 85%)"
                width="5"
                height="30"
                clipPath="url(#pencil-eraser)"
              ></rect>
              <rect fill="hsl(30, 20%, 80%)" width="30" height="20"></rect>
              <rect fill="hsl(30, 20%, 75%)" width="15" height="20"></rect>
              <rect fill="hsl(30, 20%, 85%)" width="5" height="20"></rect>
              <rect
                fill="hsla(30, 20%, 75%, 0.2)"
                y="6"
                width="30"
                height="2"
              ></rect>
              <rect
                fill="hsla(30, 20%, 75%, 0.2)"
                y="13"
                width="30"
                height="2"
              ></rect>
            </g>
          </g>
          <g
            className="pencil__point"
            transform="rotate(-90) translate(49,-30)"
          >
            <polygon fill="hsl(33,90%,70%)" points="15 0,30 30,0 30"></polygon>
            <polygon fill="hsl(33,90%,50%)" points="15 0,6 30,0 30"></polygon>
            <polygon
              fill="hsl(223,10%,10%)"
              points="15 0,20 10,10 10"
            ></polygon>
          </g>
        </g>
      </svg>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📘 Моите класове</h1>

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
