"use client";

import { useState } from "react";
import LogoutButton from "./components/Logout";
import MyStudents from "./components/MyStudents";

export default function ParentPanel() {
  const [tab, setTab] = useState<"dashboard" | "students" | "messages" | "profile">("dashboard");

  return (
    <div className="flex h-screen bg-green-400">
      {/* Sidebar */}
      <div className="w-64 bg-yellow-400 shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">📚 Родителски панел</h2>

        <nav className="space-y-4">
          <button
            onClick={() => setTab("dashboard")}
            className={`block w-full text-left p-2 rounded ${tab === "dashboard" ? "bg-blue-100 font-semibold" : ""}`}
          >
            🏠 Начало
          </button>
          <button
            onClick={() => setTab("students")}
            className={`block w-full text-left p-2 rounded ${tab === "students" ? "bg-blue-100 font-semibold" : ""}`}
          >
            👨‍👧 Моите ученици
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`block w-full text-left p-2 rounded ${tab === "messages" ? "bg-blue-100 font-semibold" : ""}`}
          >
            💬 Съобщения
          </button>
          <button
            onClick={() => setTab("profile")}
            className={`block w-full text-left p-2 rounded ${tab === "profile" ? "bg-blue-100 font-semibold" : ""}`}
          >
            ⚙️ Профил
          </button>
          
       <LogoutButton />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {tab === "dashboard" && <p>Тук ще има обобщена информация.</p>}
        {tab === "students" && <>
        
          <MyStudents />
        </>}
        {tab === "messages" && <p>Съобщения и комуникация.</p>}
        {tab === "profile" && <p>Настройки на профила.</p>}
      </div>

    </div>
  );
}
