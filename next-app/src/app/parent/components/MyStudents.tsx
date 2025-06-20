import React, { useRef } from "react";
import { api } from "@/app/utils/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

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
  const modalRef = useRef<HTMLDivElement>(null);
  const [details, setDetails] = useState<{
    grades: Grade[];
    attendances: any[];
    warnings: any[];
  } | null>(null);
  const [detailTab, setDetailTab] = useState<
    "grades" | "attendance" | "warnings"
  >("grades");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelected(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchDetails = async (studentId: string) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`users/${studentId}/details`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDetails(res.data);
  };
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res.data.children);
      setStudents(res.data.children || []);
    } catch (error) {
      toast.error("Грешка при зареждане на учениците.");
      console.log(error);
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
            onClick={() => setSelected(student)}
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
      {selected && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded shadow max-w-xl w-full relative text-black"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 "
            >
              ❌
            </button>

            <h3 className="text-xl font-bold mb-4 ">
              📄 Данни за {selected.firstName} {selected.lastName}
            </h3>

            <div className="tabs flex gap-4">
              <button
                className={detailTab === "grades" ? "active" : ""}
                onClick={() => setDetailTab("grades")}
              >
                Оценки
              </button>
              <button
                className={detailTab === "attendance" ? "active" : ""}
                onClick={() => setDetailTab("attendance")}
              >
                Присъствия
              </button>
              <button
                className={detailTab === "warnings" ? "active" : ""}
                onClick={() => setDetailTab("warnings")}
              >
                Забележки
              </button>
            </div>
            {detailTab === "grades" && details ? (
              <table>
                ...
                {details.grades.map((g) => (
                  <tr key={g.id}>
                    <td>{g.subject.name}</td>
                    <td>{g.value}</td>
                  </tr>
                ))}
              </table>
            ) : detailTab === "attendance" && details ? (
              <div>Присъствия: {details.attendances.length}</div>
            ) : detailTab === "warnings" && details ? (
              <ul>
                {details.warnings.map((w) => (
                  <li key={w.id}>
                    {w.title}: {w.body}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Зареждане...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStudents;
