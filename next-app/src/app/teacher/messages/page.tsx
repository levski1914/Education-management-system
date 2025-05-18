"use client";

import { useEffect, useState } from "react";
import MessagesList from "./MessagesList";
import SendMessage from "./SendMessages";
import { api } from "@/app/utils/api";

export default function MessagesPage() {
  const [view, setView] = useState<"inbox" | "send">("inbox");
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    fetchUnread();
  }, []);

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
          onClick={() => setView("send")}
          className={`px-4 py-2 rounded relative inline-block ${
            view === "send"
              ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-300"
              : "bg-gray-200 cursor-pointer hover:bg-gray-400 "
          }`}
        >
          📨 Съобщения
          <span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </span>
        </button>
      </div>

      <SendMessage fetchUnread={fetchUnread} />
    </div>
  );
}
