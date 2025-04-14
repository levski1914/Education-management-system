"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/teachers", label: "Учители" },
    { href: "/admin/classrooms", label: "Управление Класове" },
    { href: "/admin/students", label: "Ученици", warningKey: "students" },
    { href: "/admin/parents", label: "Родители" },
  ];

  const [warnings, setWarnings] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchWarnings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/students/warning-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWarnings(res.data);
      } catch (err) {
        console.error("Грешка при зареждане на забележки:", err);
      }
    };
    fetchWarnings();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">🏫 ДИРЕКТОР ПАНЕЛ</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const badgeCount = item.warningKey ? warnings[item.warningKey] : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-zinc-700 hover:text-blue-300"
                }`}
              >
                <span>{item.label}</span>
                {badgeCount > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                    ⚠️ {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
}
