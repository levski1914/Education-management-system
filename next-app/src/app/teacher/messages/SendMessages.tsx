"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/app/utils/api";

export default function Messenger() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedNewUserId, setSelectedNewUserId] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const currentUserId = localStorage.getItem("userId");

  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/messages/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setConversations(res.data);
  };
  const fetchAllUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllUsers(res.data);
  };

  const fetchConversationMessages = async (userId: string) => {
    setSelectedUserId(userId);
    const token = localStorage.getItem("token");
    const res = await api.get(`/messages/thread/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!selectedUserId || !newMessage.trim()) return;
    const token = localStorage.getItem("token");
    await api.post(
      "/messages",
      { body: newMessage, title: "", receiverId: selectedUserId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewMessage("");
    fetchConversationMessages(selectedUserId);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[80vh] p-4">
      {/* Left: Conversations */}
      <div className="w-1/3 border-r pr-4 overflow-y-auto">
        <div className="mb-4">
          <button
            onClick={() => {
              setShowNewMessageForm(true);
              fetchAllUsers();
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            ✉️ Изпрати съобщение
          </button>
        </div>

        {showNewMessageForm && (
          <div className="space-y-2 mb-4 border p-3 rounded bg-white">
            <select
              value={selectedNewUserId}
              onChange={(e) => setSelectedNewUserId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">👤 Избери потребител...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Заглавие"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Съобщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                await api.post(
                  "/messages",
                  {
                    body: newMessage,
                    title: newTitle,
                    receiverId: selectedNewUserId,
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setShowNewMessageForm(false);
                setNewMessage("");
                setNewTitle("");
                setSelectedNewUserId("");
                fetchConversations(); // Обнови списъка
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📤 Изпрати
            </button>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">Разговори</h2>
        {conversations.map((user) => (
          <div
            key={user.id}
            onClick={() => fetchConversationMessages(user.id)}
            className={`p-2 cursor-pointer rounded hover:bg-gray-200 ${
              selectedUserId === user.id ? "bg-gray-300 font-semibold" : ""
            }`}
          >
            {user.firstName} {user.lastName} ({user.role})
          </div>
        ))}
      </div>

      {/* Right: Chat */}
      <div className="w-2/3 pl-4 flex flex-col border-l">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-2 p-4 bg-yellow-200 rounded shadow-inner"
        >
          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            const sender = msg.sender || {};
            const senderName = isMine
              ? "Аз"
              : msg.sender?.firstName || msg.sender?.lastName
              ? `${msg.sender?.firstName || ""} ${
                  msg.sender?.lastName || ""
                }`.trim()
              : msg.sender?.role === "ADMIN"
              ? "АДМИН"
              : "Неизвестен";

            return (
              <div
                key={msg.id}
                className={`w-full flex ${
                  isMine ? "justify-end bg-blue-500" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[50%] p-3 rounded-lg shadow text-sm ${
                    isMine
                      ? "bg-blue-100 text-right self-end"
                      : "bg-white text-left self-start"
                  }`}
                >
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    {senderName}
                  </p>
                  <p className="text-base">{msg.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className="flex mt-2 gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напиши съобщение..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Изпрати
          </button>
        </div>
      </div>
    </div>
  );
}
