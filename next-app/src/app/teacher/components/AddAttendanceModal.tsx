// components/AddAttendanceModal.tsx
import { useEffect, useRef, useState } from "react";
import { api } from "@/app/utils/api";

export default function AddAttendanceModal({ studentId, onClose }: any) {
  const [status, setStatus] = useState("ABSENT");
  const [excused, setExcused] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);


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

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    await api.post(
      "/teacher/attendance",
      {
        studentId,
        status,
        excused,
        date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">📅 Добави отсъствие</h2>
        <div className="space-y-3">
          <div>
            <label className="block">Дата:</label>
            <input
              type="date"
              className="border w-full p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block">Статус:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border w-full p-2"
            >
              <option value="ABSENT">Отсъствал</option>
              <option value="LATE">Закъснение</option>
              <option value="PRESENT">Присъствал</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={excused}
              onChange={(e) => setExcused(e.target.checked)}
            />
            <label>Извинено</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="cursor-pointer hover:bg-red-300 rounded" onClick={onClose}>❌ Затвори</button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 cursor-pointer hover:bg-blue-300 text-white px-4 py-2 rounded"
            >
              Запиши
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
