"use client";

import { useState } from "react";
import MessagesList from "./MessagesList";
import SendMessage from "./SendMessages";

export default function MessagesPage() {
  const [view, setView] = useState<"inbox" | "send">("inbox");

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("inbox")}
          className={`px-4 py-2 rounded ${
            view === "inbox"
              ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-300"
              : "bg-gray-200 cursor-pointer hover:bg-gray-400"
          }`}
        >
          📥 Получени
        </button>
        <button
          onClick={() => setView("send")}
          className={`px-4 py-2 rounded ${
            view === "send"
              ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-300"
              : "bg-gray-200 cursor-pointer hover:bg-gray-400 "
          }`}
        >
          📨 Изпрати
        </button>
      </div>

      {view === "inbox" ? <MessagesList /> : <SendMessage />}
    </div>
  );
}
