"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

export default function TeacherLessonModal({
  lesson,
  onClose,
}: {
  lesson: any;
  onClose: () => void;
}) {
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});
  const [studentGrades, setStudentGrades] = useState<Record<string, number[]>>({});
  const [showGradeInput, setShowGradeInput] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStudents = async () => {
    const res = await api.get(`/teacher/class/${lesson.classroomId}/students`, {
      headers,
    });
    setStudents(res.data);
  };

  const markAttendance = async (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE"
  ) => {
    await api.post(
      `/attendance/${studentId}`,
      {
        lessonId: lesson.id,
        status,
      },
      { headers }
    );
    setAttendanceStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  const giveGrade = async (studentId: string, value: number) => {
    await api.post(
      "/teacher/grade",
      {
        studentId,
        subjectId: lesson.subjectId,
        value,
      },
      { headers }
    );

    setStudentGrades((prev) => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), value],
    }));
    setShowGradeInput(null);
  };

  const fetchGrades = async () => {
    const gradeMap: Record<string, number[]> = {};
    await Promise.all(
      students.map(async (s) => {
        try {
          const res = await api.get(
            `/students/student/${s.id}?subjectId=${lesson.subjectId}`,
            { headers }
          );
          gradeMap[s.id] = res.data.map((g: any) => g.value);
        } catch {
          gradeMap[s.id] = [];
        }
      })
    );
    setStudentGrades(gradeMap);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) fetchGrades();
  }, [students]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl h-[80vh] p-6 rounded-lg shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            🎓 {lesson.subject.name} - {lesson.classroom.grade}{lesson.classroom.letter} клас
          </h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:underline text-sm"
          >
            ❌ Затвори
          </button>
        </div>

        <div className="space-y-4">
          {students.map((s) => (
            <div
              key={s.id}
              className="border p-3 rounded flex justify-between items-center bg-gray-50"
            >
              <div>
                <p className="font-semibold">
                  {s.firstName} {s.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  Оценки: {studentGrades[s.id]?.join(", ") || "—"}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                {attendanceStatus[s.id] ? (
                  <span className="text-xs">
                    {attendanceStatus[s.id] === "PRESENT"
                      ? "✔️ Присъствал"
                      : attendanceStatus[s.id] === "ABSENT"
                      ? "❌ Отсъствал"
                      : "⏱️ Закъснял"}
                  </span>
                ) : (
                  ["PRESENT", "ABSENT", "LATE"].map((status) => (
                    <button
                      key={status}
                      onClick={() => markAttendance(s.id, status as any)}
                      className={`px-2 py-1 rounded text-xs text-white ${
                        status === "PRESENT"
                          ? "bg-green-500"
                          : status === "ABSENT"
                          ? "bg-red-500"
                          : "bg-yellow-500"
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

                <button
                  onClick={() => setShowGradeInput(s.id)}
                  className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                >
                  ➕ Оценка
                </button>
              </div>

              {showGradeInput === s.id && (
                <div className="absolute bg-white shadow border rounded p-2 mt-10">
                  {[2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      onClick={() => giveGrade(s.id, g)}
                      className="px-2 py-1 hover:bg-zinc-200"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
