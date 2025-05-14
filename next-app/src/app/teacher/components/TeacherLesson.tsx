"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/utils/api";

export default function TeacherLessonModal({
  lesson,
  onClose,
}: {
  lesson: any;
  onClose: () => void;
}) {
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);

  const [studentGrades, setStudentGrades] = useState<Record<string, number[]>>(
    {}
  );
  const [showGradeInput, setShowGradeInput] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // затваря модала
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (lesson?.id) {
      fetchAttendance(lesson.id);
    }
  }, [lesson?.id]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const fetchAttendance = async (lessonId: string) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await api.get(`/attendance/lesson/${lessonId}`, { headers });
      const map: Record<string, string> = {};
      res.data.forEach((entry: any) => {
        map[entry.studentId] = entry.status;
      });
      setAttendanceStatus(map);
    } catch (err) {
      console.error("❌ Грешка при взимане на присъствия", err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    const res = await api.get(`/teacher/class/${lesson.classroomId}/students`, {
      headers,
    });
    setStudents(res.data);
    setLoading(false);
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

  // if (loading) {
  //   return (
  //     <svg
  //       className="pencil"
  //       viewBox="0 0 200 200"
  //       width="200px"
  //       height="200px"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <defs>
  //         <clipPath id="pencil-eraser">
  //           <rect rx="5" ry="5" width="30" height="30"></rect>
  //         </clipPath>
  //       </defs>
  //       <circle
  //         className="pencil__stroke"
  //         r="70"
  //         fill="none"
  //         stroke="currentColor"
  //         stroke-width="2"
  //         stroke-dasharray="439.82 439.82"
  //         stroke-dashoffset="439.82"
  //         stroke-linecap="round"
  //         transform="rotate(-113,100,100)"
  //       ></circle>
  //       <g className="pencil__rotate" transform="translate(100,100)">
  //         <g fill="none">
  //           <circle
  //             className="pencil__body1"
  //             r="64"
  //             stroke="hsl(30, 30%, 50%)"
  //             stroke-width="30"
  //             stroke-dasharray="402.12 402.12"
  //             stroke-dashoffset="402"
  //             transform="rotate(-90)"
  //           ></circle>
  //           <circle
  //             className="pencil__body2"
  //             r="74"
  //             stroke="hsl(30, 30%, 60%)"
  //             stroke-width="10"
  //             stroke-dasharray="464.96 464.96"
  //             stroke-dashoffset="465"
  //             transform="rotate(-90)"
  //           ></circle>
  //           <circle
  //             className="pencil__body3"
  //             r="54"
  //             stroke="hsl(30, 30%, 40%)"
  //             stroke-width="10"
  //             stroke-dasharray="339.29 339.29"
  //             stroke-dashoffset="339"
  //             transform="rotate(-90)"
  //           ></circle>
  //         </g>
  //         <g className="pencil__eraser" transform="rotate(-90) translate(49,0)">
  //           <g className="pencil__eraser-skew">
  //             <rect
  //               fill="hsl(30, 20%, 90%)"
  //               rx="5"
  //               ry="5"
  //               width="30"
  //               height="30"
  //             ></rect>
  //             <rect
  //               fill="hsl(30, 20%, 85%)"
  //               width="5"
  //               height="30"
  //               clip-path="url(#pencil-eraser)"
  //             ></rect>
  //             <rect fill="hsl(30, 20%, 80%)" width="30" height="20"></rect>
  //             <rect fill="hsl(30, 20%, 75%)" width="15" height="20"></rect>
  //             <rect fill="hsl(30, 20%, 85%)" width="5" height="20"></rect>
  //             <rect
  //               fill="hsla(30, 20%, 75%, 0.2)"
  //               y="6"
  //               width="30"
  //               height="2"
  //             ></rect>
  //             <rect
  //               fill="hsla(30, 20%, 75%, 0.2)"
  //               y="13"
  //               width="30"
  //               height="2"
  //             ></rect>
  //           </g>
  //         </g>
  //         <g
  //           className="pencil__point"
  //           transform="rotate(-90) translate(49,-30)"
  //         >
  //           <polygon fill="hsl(33,90%,70%)" points="15 0,30 30,0 30"></polygon>
  //           <polygon fill="hsl(33,90%,50%)" points="15 0,6 30,0 30"></polygon>
  //           <polygon
  //             fill="hsl(223,10%,10%)"
  //             points="15 0,20 10,10 10"
  //           ></polygon>
  //         </g>
  //       </g>
  //     </svg>
  //   );
  // }
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[300px]">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
  //     </div>
  //   );
  // }
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-4xl h-[80vh] p-6 rounded-lg shadow-lg overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            🎓 {lesson.subject.name} - {lesson.classroom.grade}
            {lesson.classroom.letter} клас
          </h2>
          <button
            onClick={onClose}
            className="text-red-600 cursor-pointer hover:underline text-sm"
          >
            ❌ Затвори
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
            </div>
          ) : (
            students.map((s) => (
              <div
                key={s.id}
                className="border p-3 rounded flex justify-between items-center bg-gray-50"
              >
                {/* 👇 Името + оценки */}
                <div>
                  <p className="font-semibold">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Оценки: {studentGrades[s.id]?.join(", ") || "—"}
                  </p>
                </div>

                {/* 👇 Присъствие + бутон за оценка */}
                <div className="flex gap-2 items-center">
                  {attendanceStatus[s.id] ? (
                    <button
                      className={`px-2 py-1 rounded text-xs cursor-default ${
                        attendanceStatus[s.id] === "PRESENT"
                          ? "bg-green-500"
                          : attendanceStatus[s.id] === "ABSENT"
                          ? "bg-red-500"
                          : "bg-yellow-400"
                      }`}
                      disabled
                    >
                      {attendanceStatus[s.id] === "PRESENT"
                        ? "✔️ Присъствал"
                        : attendanceStatus[s.id] === "ABSENT"
                        ? "❌ Отсъствал"
                        : "⏱️ Закъснял"}
                    </button>
                  ) : (
                    ["PRESENT", "ABSENT", "LATE"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          markAttendance(
                            s.id,
                            status as "PRESENT" | "ABSENT" | "LATE"
                          )
                        }
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

                  <button
                    onClick={() => setShowGradeInput(s.id)}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                  >
                    ➕ Оценка
                  </button>
                </div>

                {/* 👇 Оценяване */}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
