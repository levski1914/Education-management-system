"use client";

import { useEffect, useState } from "react";
import LogoutButton from "./components/Logout";
import MyStudents from "./components/MyStudents";
import MessagesPage from "./messages/page";
import { api } from "../utils/api";
import ParentDashboard from "./components/ParentDashboard";

export default function ParentPanel() {
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
  const [tab, setTab] = useState<
    "dashboard" | "students" | "messages" | "profile"
  >("dashboard");

  return (
    <div className="flex h-screen bg-green-400">
      {/* Sidebar */}
      <div className="w-64 bg-yellow-400 shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">📚 Родителски панел</h2>

        <nav className="space-y-4">
          <button
            onClick={() => setTab("dashboard")}
            className={`block w-full text-left border p-2 rounded cursor-pointer ${
              tab === "dashboard" ? "bg-blue-100 font-semibold" : ""
            }`}
          >
            🏠 Начало
          </button>
          <button
            onClick={() => setTab("students")}
            className={`block w-full text-left border p-2 rounded cursor-pointer ${
              tab === "students" ? "bg-blue-100 font-semibold" : ""
            }`}
          >
            👨‍👧 Моите ученици
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`block w-full relative border text-left p-2 rounded cursor-pointer ${
              tab === "messages" ? "bg-blue-100 font-semibold" : ""
            }`}
          >
            💬 Съобщения
            {unreadCount > 0 && (
              <span className="absolute -top-2 border -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("profile")}
            className={`block w-full text-left border p-2 rounded cursor-pointer ${
              tab === "profile" ? "bg-blue-100 font-semibold" : ""
            }`}
          >
            ⚙️ Профил
          </button>

          <LogoutButton />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {tab === "dashboard" && <ParentDashboard />}
        {tab === "students" && (
          <>
            <MyStudents />
          </>
        )}
        {tab === "messages" && <MessagesPage />}
        {tab === "profile" && <p>Настройки на профила.</p>}
      </div>
    </div>
  );
}
