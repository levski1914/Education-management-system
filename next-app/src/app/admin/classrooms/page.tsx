"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import LessonModal from "../components/LessonModal";
type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

type Classroom = {
  id: string;
  name: string;
  grade: string;
  letter: string;
  classTeacher?: User;
  students: User[];
};

export default function AdminClassRoomPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [grade, setGrade] = useState(1);
  const [letter, setLetter] = useState("A");
  const [loading, setLoading] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [showLessonModal, setShowLessonModal] = useState(false);

  const fetchClassRooms = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/classrooms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClassrooms(res.data);
  };

  const handleCreate = async () => {
    if (loading) return;
    const alreadyExists = classrooms.some(
      (cls) => cls.grade === grade.toString() && cls.letter === letter
    );
    if (alreadyExists) {
      alert("❗ Този клас вече съществува.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/classrooms",
        { grade, letter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchClassRooms();
      setGrade(1);
      setLetter("A");
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Грешка при създаване на клас");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassRooms();
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">📚 Класове</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="number"
          value={grade}
          onChange={(e) => setGrade(parseInt(e.target.value))}
          className="bg-zinc-800 p-2 rounded w-24"
          placeholder="Клас"
        />
        <input
          value={letter}
          onChange={(e) => setLetter(e.target.value.toUpperCase())}
          className="bg-zinc-800 p-2 rounded w-24"
          placeholder="Паралелка"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-zinc-500" : "bg-green-600"
          }`}
        >
          {loading ? "Добавяне..." : "➕ Добави"}
        </button>
      </div>

      <div className="grid gap-4">
        {classrooms.map((cls) => (
          <div
            key={cls.id}
            className="p-4 bg-zinc-800 rounded flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{cls.name} клас</h2>
              <p>
                🧑‍🏫 Класен:{" "}
                {cls.classTeacher?.firstName
                  ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}`
                  : "няма"}
              </p>
            </div>
            <div className="text-zinc-400 text-sm">
              👦 Ученици: {cls.students.length}
            </div>
            <button
              onClick={() => {
                setSelectedClassroom(cls);
                setShowLessonModal(true);
              }}
              className="bg-indigo-600 px-3 py-1 rounded text-sm"
            >
              ⚙️ Управление
            </button>
          </div>
        ))}
      </div>
      {showLessonModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black opacity-100 flex items-center justify-center z-50">
          <LessonModal
            classroomId={selectedClassroom.id}
            onClose={() => {
              setSelectedClassroom(null);
              setShowLessonModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
