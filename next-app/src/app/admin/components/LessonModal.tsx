"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

export default function LessonModal({
  classroomId,
  onClose,
}: {
  classroomId: string;
  onClose: () => void;
}) {
  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const [day, setDay] = useState(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:45");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [subs, teachs, less] = await Promise.all([
      api.get("/subjects", { headers }),
      api.get("/users?role=TEACHER", { headers }),
      api.get(`/lessons/classroom/${classroomId}`, { headers }),
    ]);

    setSubjects(subs.data);
    setTeachers(teachs.data);
    setLessons(less.data);
    if (less.data[0]?.classroom?.students) {
      setStudents(less.data[0].classroom.students);
    }
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

  useEffect(() => {
    fetchData();
  }, []);

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
            <ul className="text-sm list-disc list-inside space-y-1">
              {students.map((s: any) => (
                <li key={s.id}>
                  {s.firstName} {s.lastName}
                </li>
              ))}
            </ul>
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
