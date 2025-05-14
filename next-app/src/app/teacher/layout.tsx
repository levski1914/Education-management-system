"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./components/Logout";
import { useEffect } from "react";

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
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return router.push("/login");

    const parsed = JSON.parse(user);
    if (parsed.role !== "TEACHER") {
      router.push("/unauthorized");
    }
  }, []);

  const pathname = usePathname();

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
        <LogoutButton />
      </aside>

      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
