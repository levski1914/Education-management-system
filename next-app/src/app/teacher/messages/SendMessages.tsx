"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/app/utils/api";
export function getCurrentUserId() {
  if (typeof window === "undefined") return null;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || null;
  } catch {
    return null;
  }
}

interface MessengerProps {
  fetchUnread: () => void;
}

export default function Messenger({ fetchUnread }: MessengerProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedNewUserId, setSelectedNewUserId] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const currentUserId = getCurrentUserId();
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    fetchUnread();
  }, []);
  const handleConversationClick = async (
    userId: string,
    lastMessageId: string
  ) => {
    setSelectedUserId(userId);
    await fetchConversationMessages(userId);

    if (lastMessageId) {
      const token = localStorage.getItem("token");
      await api.put(
        `/messages/mark-all-read/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (fetchUnread) {
        fetchUnread();
      } // нулира само за този разговор
      await fetchConversations(); // обнови bold-а и състоянието
    }
  };

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
            className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            ✉️ Изпрати съобщение
          </button>
        </div>

        {showNewMessageForm && (
          <div className="space-y-2 mb-4 border p-3 rounded bg-white">
            <select
              value={selectedNewUserId}
              onChange={(e) => setSelectedNewUserId(e.target.value)}
              className="w-full cursor-pointer p-2 border rounded"
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
            <div className="flex justify-between">
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
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700"
              >
                📤 Изпрати
              </button>
              <button
                onClick={() => {
                  setShowNewMessageForm(false);
                }}
                className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-300"
              >
                Затвори
              </button>
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">Разговори</h2>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => handleConversationClick(conv.id, conv.lastMessageId)}
            className={`p-2 cursor-pointer rounded border my-2 hover:bg-gray-200 ${
              selectedUserId === conv.id ? "bg-gray-300" : ""
            }`}
          >
            <div className="font-medium">
              {conv.firstName} {conv.lastName} ({conv.role})
            </div>
            <div
              className={`text-sm ${
                conv.unread ? "font-bold" : "text-gray-500"
              }`}
            >
              {conv.lastMessage}
            </div>
          </div>
          // <hr />
        ))}
      </div>

      {/* Right: Chat */}
      {/* Right: Chat area */}
      <div className="w-2/3 pl-4 flex flex-col border-l h-full">
        {/* Chat messages container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-2 p-4 bg-yellow-200 rounded shadow-inner"
        >
          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
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
              <div key={msg.id} className="w-full flex">
                {isMine ? (
                  <div className="ml-auto bg-blue-500 p-3 rounded-lg shadow text-sm max-w-[60%] text-right">
                    <p className="text-xs text-right text-black-600  font-semibold mb-1">
                      {senderName}:
                    </p>
                    <p className="text-white border-top border-t-indigo-500">
                      {msg.body}
                    </p>
                  </div>
                ) : (
                  <div className="mr-auto bg-white p-3 rounded-lg shadow text-sm max-w-[60%] text-left">
                    <p className="text-xs text-blue-600  font-bold mb-1">
                      {senderName}
                    </p>
                    <p>{msg.body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input field at bottom */}
        {selectedUserId && (
          <div className="flex gap-2 p-4 border-t bg-yellow-100">
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
        )}
      </div>
    </div>
  );
}
