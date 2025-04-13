"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    { href: "/admin/students", label: "Ученици" },
    { href: "/admin/parents", label: "Родители" },
  ];
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">🏫 ДИРЕКТОР ПАНЕЛ</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-zinc-700 hover:text-blue-300"
                }`}
              >
                {item.label}
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
