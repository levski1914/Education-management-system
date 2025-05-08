import { useEffect, useRef, useState } from "react";
import { api } from "@/app/utils/api";

export default function AddGradeModal({ studentId, onClose }: any) {
  const [value, setValue] = useState(6);
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [type, setType] = useState("контролно");


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
    const fetchSubjects = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/teacher/my-subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
      if (res.data.length > 0) {
        setSubjectId(res.data[0].id);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    await api.post(
      "/teacher/grade",
      { studentId, value, subjectId, type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-lg font-bold">📝 Добави оценка</h2>

        <div>
          <label>Стойност (1–6):</label>
          <input
            type="number"
            value={value}
            min={1}
            max={6}
            onChange={(e) => setValue(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Тип:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 w-full"
          >
            <option>контролно</option>
            <option>тест</option>
            <option>класна</option>
          </select>
        </div>

        <div>
          <label>Предмет:</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="border p-2 w-full"
          >
            {subjects.map((sub: any) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 cursor-pointer hover:bg-red-600 hover:text-white">
            Затвори
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 cursor-pointer hover:bg-blue-300 text-white px-4 py-2 rounded"
          >
            Запиши
          </button>
        </div>
      </div>
    </div>
  );
}
