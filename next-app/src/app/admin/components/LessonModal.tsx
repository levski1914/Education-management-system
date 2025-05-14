"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { getTodayDayOfWeek } from "@/app/utils/days";

export default function LessonModal({
  classroomId,
  onClose,
}: {
  classroomId: string;
  onClose: () => void;
}) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, string>
  >({});
  const [studentGrades, setStudentGrades] = useState<Record<string, number[]>>(
    {}
  );
  const [showGradeInput, setShowGradeInput] = useState<string | null>(null);
  const [day, setDay] = useState(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:45");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const isCurrentLesson = (lesson: any) => {
    const now = new Date();

    // Сравни дали е същия ден от седмицата (1-Понеделник до 5-Петък)
    const today = getTodayDayOfWeek(); // връща 1–7
    const isSameDay = today === lesson.dayOfWeek;


    if (!isSameDay) return false;

    const start = new Date();
    const end = new Date();
    const [startH, startM] = lesson.startTime.split(":");
    const [endH, endM] = lesson.endTime.split(":");
    start.setHours(+startH, +startM, 0);
    end.setHours(+endH, +endM, 0);

    return now >= start && now <= end;
  };

  const fetchData = async () => {
    const [subs, teachs, less, classData] = await Promise.all([
      api.get("/subjects", { headers }),
      api.get("/users?role=TEACHER", { headers }),
      api.get(`/lessons/classroom/${classroomId}`, { headers }),
      api.get(`/classrooms/${classroomId}`, { headers }),
    ]);

    setSubjects(subs.data);
    setTeachers(teachs.data);
    setLessons(less.data);
    setStudents(
      classData.data.students.sort((a: any, b: any) =>
        a.firstName.localeCompare(b.firstName)
      )
    );
  };

  const markAttendance = async (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE"
  ) => {
    const lesson = lessons.find(
      (l) => l.dayOfWeek === day && isCurrentLesson(l)
    );
    if (!lesson) return;
    await api.post(
      `/attendance/${studentId}`,
      { lessonId: lesson.id, status },
      { headers }
    );
    setAttendanceStatus({ ...attendanceStatus, [studentId]: status });
  };

  const giveGrade = async (studentId: string, value: number) => {
    const lesson = lessons.find(
      (l) => l.dayOfWeek === day && isCurrentLesson(l)
    );
    if (!lesson) return;

    try {
      await api.post(
        `/grades/${studentId}`,
        {
          subjectId: lesson.subjectId,
          lessonId: lesson.id,
          value,
        },
        { headers }
      );

      // 🔄 Добави веднага в UI
      setStudentGrades((prev) => ({
        ...prev,
        [studentId]: [...(prev[studentId] || []), value],
      }));

      // 🧠 След малко вземи "истинските" от базата
      setTimeout(() => {
        fetchGrades();
      }, 300);
    } catch (err) {
      console.error("Грешка при запис на оценка", err);
    }
  };

  const fetchGrades = async () => {
    const lesson = lessons.find(
      (l) => l.dayOfWeek === day && isCurrentLesson(l)
    );
    if (!lesson) return;

    const subjectId = lesson.subjectId;
    const gradeMap: Record<string, number[]> = {};

    await Promise.all(
      students.map(async (s) => {
        try {
          const res = await api.get(
            `/students/student/${s.id}?subjectId=${subjectId}`,
            { headers }
          );

          gradeMap[s.id] = res.data.map((g: any) => g.value); // 🔁 all grades
        } catch (err) {
          console.error("❌ Fetching grades failed", err);
          gradeMap[s.id] = [];
        }
      })
    );

    setStudentGrades(gradeMap);
  };

  const createLesson = async () => {
    await api.post(
      "/lessons",
      { subjectId, teacherId, classroomId, dayOfWeek: day, startTime, endTime },
      { headers }
    );
    fetchData();
  };
  const createSubject = async () => {
    await api.post("/subjects", { name: newSubjectName }, { headers });
    setNewSubjectName("");
    fetchData();
  };
  const deleteLesson = async (id: string) => {
    await api.delete(`/lessons/${id}`, { headers });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [lessons, day]);

  return (
    <div className="bg-white text-black p-6 rounded w-full max-w-6xl h-[85vh] flex overflow-hidden">
      <div className="w-1/3 pr-6 border-r space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold mb-2">📅 Календар</h3>
          <div className="flex gap-2">
            {["П", "В", "С", "Ч", "Пт"].map((d, i) => (
              <button
                key={i}
                onClick={() => setDay(i + 1)}
                className={`w-10 h-10 rounded font-bold hover:bg-zinc-400 cursor-pointer ${
                  day === i + 1
                    ? "bg-blue-600 hover:bg-blue-600 cursor-pointer text-white"
                    : "bg-zinc-200 "
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">👨‍🎓 Ученици</h3>
          {students.map((s) => {
            const selectedStatus = attendanceStatus[s.id];
            const currentLesson = lessons.find(
              (l) => l.dayOfWeek === day && isCurrentLesson(l)
            );

            return (
              <div key={s.id} className="border-b pb-2 mb-2 space-y-1">
                <div className="flex justify-between items-start">
                  <span>
                    {s.firstName} {s.lastName}
                    <div className="text-md text-gray-700 mt-1">
                      Оценки: {studentGrades[s.id]?.join(", ") || "—"}
                    </div>
                  </span>

                  {currentLesson ? (
                    <div className="flex gap-1 flex-wrap justify-end">
                      {/* присъствие */}
                      {selectedStatus ? (
                        <button
                          className={`px-2 py-1 rounded text-xs ${
                            selectedStatus === "PRESENT"
                              ? "bg-green-500"
                              : selectedStatus === "ABSENT"
                              ? "bg-red-500"
                              : "bg-yellow-400"
                          }`}
                          onClick={() =>
                            setAttendanceStatus({
                              ...attendanceStatus,
                              [s.id]: undefined,
                            })
                          }
                        >
                          {selectedStatus === "PRESENT"
                            ? "✔️ Присъствал"
                            : selectedStatus === "ABSENT"
                            ? "❌ Отсъствал"
                            : "⏱️ Закъснял"}
                        </button>
                      ) : (
                        ["PRESENT", "ABSENT", "LATE"].map((status) => (
                          <button
                            key={status}
                            onClick={() => markAttendance(s.id, status as any)}
                            className={`p-2 rounded text-xs ${
                              status === "PRESENT"
                                ? "bg-green-500"
                                : status === "ABSENT"
                                ? "bg-red-500"
                                : "bg-yellow-400"
                            }`}
                          >
                            {status === "PRESENT"
                              ? "✔️"
                              : status === "ABSENT"
                              ? "❌"
                              : "⏱️"}
                          </button>
                        ))
                      )}

                      {/* оценка */}
                      <button
                        onClick={() =>
                          setShowGradeInput((prev) =>
                            prev === s.id ? null : s.id
                          )
                        }
                        className="bg-blue-500 text-white text-xs px-2 rounded"
                      >
                        ➕ Оценка
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Въвеждане на оценка */}
                {showGradeInput === s.id && currentLesson && (
                  <div className="flex gap-1 mt-1">
                    {[2, 3, 4, 5, 6].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => {
                          giveGrade(s.id, grade);
                          setShowGradeInput(null);
                        }}
                        className="bg-zinc-300 px-2 rounded text-sm hover:bg-zinc-400"
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 pl-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between mt-4">
          <h2 className="text-xl font-bold">📚 Управление на уроци</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-300 cursor-pointer text-white rounded"
          >
            Затвори
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Име на предмет"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={createSubject}
            disabled={!newSubjectName.trim()}
            className="bg-blue-600 hover:bg-blue-300 cursor-pointer text-white px-4 py-2 rounded"
          >
            Добави
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            className="p-2 border hover:bg-gray-300 cursor-pointer rounded"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Предмет</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="p-2 border hover:bg-indigo-300 cursor-pointer rounded"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Учител</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <button
          onClick={createLesson}
          disabled={!subjectId || !teacherId}
          className="bg-green-600 hover:bg-green-300 cursor-pointer text-white px-4 py-2 rounded"
        >
          ➕ Добави урок
        </button>

        <div>
          <h3 className="font-semibold mb-2 mt-6">📅 Уроци за деня:</h3>
          {lessons
            .filter((l) => l.dayOfWeek === day)
            .map((l) => (
              <div
                key={l.id}
                className="p-2 border-b flex justify-between items-center"
              >
                <span>
                  🕘 {l.startTime} - {l.endTime} | 📘 {l.subject?.name} (👨‍🏫{" "}
                  {l.teacher?.firstName} {l.teacher?.lastName})
                </span>
                <button
                  onClick={() => deleteLesson(l.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
