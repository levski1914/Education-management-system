"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./components/Logout";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

const links = [
  { href: "/teacher/profile", label: "Моят Профил", emoji: "👤" },
  { href: "/teacher", label: "Моите класове", emoji: "📘" },
  { href: "/teacher/schedule", label: "Разписание", emoji: "🕒" },
  { href: "/teacher/students", label: "Ученици", emoji: "👨‍🎓" },
  { href: "/teacher/grades", label: "Оценки", emoji: "📝" },
  { href: "/teacher/attendance", label: "Присъствия", emoji: "📅" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return router.push("/login");

    const parsed = JSON.parse(user);
    if (parsed.role !== "TEACHER") {
      router.push("/unauthorized");
    }

    fetchUnread();
  }, []);

  const pathname = usePathname();
  const fetchUnread = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/messages/unread-count", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUnreadCount(res.data.count);
  };
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">👨‍🏫 Учителски Панел</h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className={`block px-4 py-2 rounded ${
                  pathname === link.href ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                {link.emoji} {link.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <Link href="/teacher/messages" className="relative inline-block">
            <span className="text-2xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
        <LogoutButton />
      </aside>

      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
