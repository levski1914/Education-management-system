"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

export default function MessagesList() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const res = await api.get("/messages", { headers });
    setMessages(res.data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    await api.put(`/messages/${id}/read`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMessages(); // презареди списъка
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <p>📩 Зареждане на съобщения...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">📬 Моите съобщения</h1>

      {messages.length === 0 && (
        <p className="text-sm text-gray-500 italic">Няма съобщения.</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-4 border rounded shadow ${
            msg.readBy?.includes(localStorage.getItem("userId")!)
              ? "bg-white"
              : "bg-yellow-100"
          }`}
        >
          <h2 className="text-lg font-semibold">{msg.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{msg.body}</p>
          <p className="text-xs text-gray-400 mt-2">
            🕓 {new Date(msg.createdAt).toLocaleString()}
          </p>
          {!msg.readBy?.includes(localStorage.getItem("userId")!) && (
            <button
              onClick={() => markAsRead(msg.id)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              📖 Маркирай като прочетено
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
