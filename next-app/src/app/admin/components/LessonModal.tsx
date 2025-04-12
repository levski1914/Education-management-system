"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};
export default function LessonModal({
  classroomId,
  onClose,
}: {
  classroomId: string;
  onClose: () => void;
}) {
  const [lessons, setLessons] = useState<
    {
      id: string;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      subjectId: string;
      subject?: { name: string };
      teacher?: { firstName: string; lastName: string };
    }[]
  >([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeMap, setGradeMap] = useState<Record<string, number>>({});

  const [day, setDay] = useState(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:45");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");

  const isCurrentLesson = (lesson: any) => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    const [startH, startM] = lesson.startTime.split(":");
    const [endH, endM] = lesson.endTime.split(":");

    start.setHours(+startH, +startM, 0);
    end.setHours(+endH, +endM, 0);

    const inTime = now >= start && now <= end;
    // console.log("⏱️ isCurrentLesson", inTime, lesson.startTime, lesson.endTime);
    return inTime;
  };

  const markAttendance = async (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE"
  ) => {
    const token = localStorage.getItem("token");
    const currentLesson = lessons.find(
      (l) => l.dayOfWeek === day && isCurrentLesson(l)
    ) as (typeof lessons)[number] | undefined;
    if (!currentLesson) return;

    await api.post(
      `/attendance/${studentId}`,
      {
        lessonId: currentLesson.id,
        status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const giveGrade = async (studentId: string, value: number) => {
    const token = localStorage.getItem("token");
    const currentLesson = lessons.find(
      (l: any) => l.dayOfWeek === day && isCurrentLesson(l)
    );
    if (!currentLesson) return;

    await api.post(
      `/grades/${studentId}`,
      {
        subjectId: currentLesson.subjectId,
        lessonId: currentLesson.id,
        value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [subs, teachs, less, classData] = await Promise.all([
      api.get("/subjects", { headers }),
      api.get("/users?role=TEACHER", { headers }),
      api.get(`/lessons/classroom/${classroomId}`, { headers }),
      api.get(`/classrooms/${classroomId}`, { headers }),
    ]);

    setSubjects(subs.data);
    setTeachers(teachs.data);
    setLessons(less.data);
    setStudents(classData.data.students); // 💡 ето тук вече е точно
  };

  const createSubject = async () => {
    const token = localStorage.getItem("token");
    await api.post(
      "/subjects",
      { name: newSubjectName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewSubjectName("");
    await fetchData();
  };

  const createLesson = async () => {
    const token = localStorage.getItem("token");
    await api.post(
      "/lessons",
      {
        subjectId,
        teacherId,
        classroomId,
        dayOfWeek: day,
        startTime,
        endTime,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchData();
    setSubjectId("");
    setTeacherId("");
  };
  const fetchGrades = async () => {
    const token = localStorage.getItem("token");
    const lesson = lessons.find(
      (l) => l.dayOfWeek === day && isCurrentLesson(l)
    );
    if (!lesson) return;

    const res = await api.get(`/grades/lesson/${lesson.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const map: Record<string, number> = {};
    res.data.forEach((g: any) => {
      map[g.studentId] = g.value;
    });
    setGradeMap(map);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [lessons, day]); // ❗ Сложи го така

  return (
    <div className="bg-white opacity-100 text-black  p-6 rounded w-full max-w-6xl h-[85vh] flex overflow-hidden">
      {/* Ляв панел - календар + ученици */}
      <div className="w-1/3 pr-6 border-r space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold mb-2">📅 Календар</h3>

          <div className="flex gap-2">
            {["П", "В", "С", "Ч", "Пт"].map((d, i) => (
              <button
                key={i}
                onClick={() => setDay(i + 1)}
                className={`w-10 h-10 rounded font-bold ${
                  day === i + 1 ? "bg-blue-600 text-white" : "bg-zinc-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">👨‍🎓 Ученици</h3>
          {students.length === 0 ? (
            <p className="text-sm text-zinc-500">Няма ученици</p>
          ) : (
            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center gap-2 border-b pb-1"
                >
                  <span>
                    {s.firstName} {s.lastName}
                  </span>

                  {lessons.some(
                    (l: any) => l.dayOfWeek === day && isCurrentLesson(l)
                  ) && (
                    <div className="flex gap-2 items-center">
                      {/* Присъствие */}
                      <button
                        onClick={() => markAttendance(s.id, "PRESENT")}
                        className="bg-green-600 px-2 py-1 rounded text-xs"
                      >
                        ✔️
                      </button>
                      <button
                        onClick={() => markAttendance(s.id, "ABSENT")}
                        className="bg-red-600 px-2 py-1 rounded text-xs"
                      >
                        ❌
                      </button>
                      <button
                        onClick={() => markAttendance(s.id, "LATE")}
                        className="bg-yellow-500 px-2 py-1 rounded text-xs"
                      >
                        ⏱️
                      </button>

                      {/* Оценка */}
                      <select
                        className="text-black text-xs rounded px-1"
                        value={gradeMap[s.id] || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!value) return;
                          setGradeMap({ ...gradeMap, [s.id]: value }); // локално
                          giveGrade(s.id, value);
                        }}
                      >
                        <option value="">🎓</option>
                        {[2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Дясна секция - форми + уроци */}
      <div className="flex-1 pl-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between mt-4">
          <h2 className="text-xl font-bold">📚 Управление на уроци</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Затвори
          </button>
        </div>
        <div>
          <h4 className="font-semibold mb-2">➕ Добави предмет:</h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Име на предмет"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="p-2 border rounded flex-1"
            />
            <button
              onClick={createSubject}
              disabled={!newSubjectName.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Добави
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            className="p-2 border rounded"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Предмет</option>
            {subjects.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Учител</option>
            {teachers.map((t: any) => (
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
          className="bg-green-600 text-white px-4 py-2 m-0 rounded"
        >
          ➕ Добави урок
        </button>

        <div>
          <h3 className="font-semibold mb-2 mt-6">📅 Уроци за деня:</h3>
          {lessons.filter((l: any) => l.dayOfWeek === day).length === 0 ? (
            <p className="text-sm text-zinc-500">Няма добавени уроци</p>
          ) : (
            lessons
              .filter((l: any) => l.dayOfWeek === day)
              .map((l: any) => (
                <div key={l.id} className="p-2 border-b">
                  🕘 {l.startTime} - {l.endTime} | 📘 {l.subject?.name} ( 👨‍🏫{" "}
                  {l.teacher?.firstName} {l.teacher?.lastName})
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
