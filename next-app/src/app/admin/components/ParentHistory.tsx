"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

export default function ParentHistory({ studentId }: { studentId: string }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get(`/users/${studentId}/parent-log`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    };

    fetchLogs();
  }, [studentId]);

  if (logs.length === 0) {
    return (
      <div className="text-sm text-gray-500">⏳ Няма данни за историята.</div>
    );
  }

  return (
    <div className="mt-4 bg-white p-4 rounded shadow">
      <h3 className="text-md font-semibold mb-2">🕓 История на връзките</h3>
      <ul className="text-sm space-y-1">
        {logs.map((log) => (
          <li key={log.id} className="border-b pb-1">
            {log.action === "ASSIGN" ? "🔗 Свързан" : "❌ Премахнат"} с{" "}
            <strong>
              {log.parent?.firstName} {log.parent?.lastName}
            </strong>{" "}
            – {new Date(log.createdAt).toLocaleString("bg-BG")}
          </li>
        ))}
      </ul>
    </div>
  );
}
