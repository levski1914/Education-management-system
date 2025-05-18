"use client";

import { useState } from "react";
import MessagesList from "@/app/teacher/messages/MessagesList";
import SendMessage from "@/app/teacher/messages/SendMessages";
import { api } from "@/app/utils/api";

export default function MessagesPage() {
  const [view, setView] = useState<"inbox" | "send">("inbox");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/messages/unread-count", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUnreadCount(res.data.count);
  };
  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("inbox")}
          className={`px-4 py-2 rounded ${
            view === "inbox" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📥 Получени
        </button>
        <button
          onClick={() => setView("send")}
          className={`px-4 py-2 rounded ${
            view === "send" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          📨 Изпрати
        </button>
      </div>

      {view === "inbox" ? (
        <MessagesList />
      ) : (
        <SendMessage fetchUnread={fetchUnread} />
      )}
    </div>
  );
}
