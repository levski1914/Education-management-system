import React, { useRef, useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { toast } from "react-toastify";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  class?: { name: string };
};

type Grade = {
  id: string;
  value: number;
  subject: {
    name: string;
  };
};

const MyStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Student | null>(null);
  const [details, setDetails] = useState<{
    grades: Grade[];
    attendances: any[];
    warnings: any[];
  } | null>(null);

  const [detailTab, setDetailTab] = useState<
    "grades" | "attendance" | "warnings"
  >("grades");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelected(null);
        setDetails(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.children || []);
    } catch (error) {
      toast.error("Грешка при зареждане на учениците.");
    }
  };

  const fetchDetails = async (student: Student) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`users/${student.id}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelected(student);
      setDetails(res.data);
    } catch (err) {
      toast.error("Грешка при зареждане на данните за ученика.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        👨‍👧 {students.length === 1 ? "Моето дете" : "Моите ученици"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length === 0 && (
          <p className="text-white">
            Все още нямате ученици, свързани с профила.
          </p>
        )}
        {students.map((student) => (
          <div
            key={student.id}
            onClick={() => fetchDetails(student)}
            className="bg-white p-4 shadow rounded cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center gap-4">
              {student.profilePic ? (
                <img
                  src={student.profilePic}
                  alt="Ученик"
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
              )}
              <div>
                <div className="font-semibold text-black">
                  {student.firstName} {student.lastName}
                </div>
                <div className="text-sm text-black">
                  Клас: {student.class?.name || "—"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модал */}
      {selected && details && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded shadow max-w-xl w-full relative text-black"
          >
            <button
              onClick={() => {
                setSelected(null);
                setDetails(null);
              }}
              className="absolute top-2 right-2"
            >
              ❌
            </button>

            <h3 className="text-xl font-bold mb-4">
              📄 Данни за {selected.firstName} {selected.lastName}
            </h3>

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setDetailTab("grades")}
                className={`py-1 px-3 rounded ${
                  detailTab === "grades" ? "bg-blue-200" : "bg-gray-100"
                }`}
              >
                Оценки
              </button>
              <button
                onClick={() => setDetailTab("attendance")}
                className={`py-1 px-3 rounded ${
                  detailTab === "attendance" ? "bg-blue-200" : "bg-gray-100"
                }`}
              >
                Присъствия
              </button>
              <button
                onClick={() => setDetailTab("warnings")}
                className={`py-1 px-3 rounded ${
                  detailTab === "warnings" ? "bg-blue-200" : "bg-gray-100"
                }`}
              >
                Забележки
              </button>
            </div>

            {/* Съдържание по таб */}
            {detailTab === "grades" && (
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Предмет</th>
                    <th className="p-2 border">Оценка</th>
                  </tr>
                </thead>
                <tbody>
                  {details.grades.map((g) => (
                    <tr key={g.id}>
                      <td className="p-2 border">{g.subject.name}</td>
                      <td className="p-2 border text-center">{g.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {detailTab === "attendance" && (
              <div className="text-sm">
                Общо отсъствия: {details.attendances.length}
              </div>
            )}

            {detailTab === "warnings" && (
              <ul className="list-disc ml-4 text-sm">
                {details.warnings.map((w: any) => (
                  <li key={w.id}>
                    {w.title}: {w.body}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStudents;
