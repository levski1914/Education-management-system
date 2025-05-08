"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import AddGradeModal from "../components/TeacherStudents";
import { StudentFiles } from "../components/StudentFiles";
import StudentProfilePage from "../file/page";
import StudentProfileModal from "../file/page";
import AddAttendanceModal from "../components/AddAttendanceModal";

export default function TeacherStudents() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalFiles, setShowModalFiles] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/teacher/my-classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    };

    fetchClasses();
  }, []);

  const fetchStudents = async (classId: string) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/teacher/class/${classId}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
    setSelectedClassId(classId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👨‍🎓 Ученици</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Избери клас:
        </label>
        <select
          onChange={(e) => fetchStudents(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
        >
          <option value="">-- Избери --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.grade}{c.letter} клас
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((s) => (
          <div
            key={s.id}
            className="bg-white border rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={s.profilePic || "/avatar.png"}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {s.firstName} {s.lastName}
                </p>
                <p className="text-sm text-gray-500">ЕГН: {s.egn}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {showModalFiles && selectedStudentId && (
                <StudentProfileModal
                  studentId={selectedStudentId}
                  onClose={() => setShowModalFiles(false)}
                />
              )}

              <a
                onClick={() => {
                  setSelectedStudentId(s.id);
                  setShowModalFiles(true);
                }}
                className="text-blue-600 text-sm hover:underline"
              >
                📂 Досие
              </a>

              {showModal && (
                <AddGradeModal
                  studentId={selectedStudentId}
                  onClose={() => setShowModal(false)}
                />
              )}
              <button
                onClick={() => {
                  setSelectedStudentId(s.id);
                  setShowModal(true);
                }}
              >
                📝 Оценка
              </button>
              {showAttendanceModal && selectedStudentId && (
                <AddAttendanceModal
                  studentId={selectedStudentId}
                  onClose={() => setShowAttendanceModal(false)}
                />
              )}
              <button
                onClick={() => {
                  setSelectedStudentId(s.id);
                  setShowAttendanceModal(true);
                }}
                className="text-yellow-600 text-sm hover:underline"
              >
                📅 Отсъствие
              </button>
              <button className="text-red-600 text-sm hover:underline">
                ⚠️ Забележка
              </button>
              {s.parent && (
                <span className="text-gray-700 text-sm">
                  📞 {s.parent.firstName} {s.parent.lastName} ({s.parent.email})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
