import { api } from "@/app/utils/api";
import { useState } from "react";

export default function AddAttendanceModal({ studentId, onClose }: any) {
  const [status, setStatus] = useState("ABSENT");
  const [excused, setExcused] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96 space-y-4">
        <h2 className="text-lg font-bold">📅 Отбележи присъствие</h2>

        <div>
          <label className="block">Дата:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block">Статус:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="PRESENT">✅ Присъствал</option>
            <option value="ABSENT">❌ Отсъствал</option>
            <option value="LATE">🕒 Закъснял</option>
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

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600">
            Затвори
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Запиши
          </button>
        </div>
      </div>
    </div>
  );
}
