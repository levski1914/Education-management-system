import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">🏫 ДИРЕКТОР ПАНЕЛ</h2>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>
          <Link href="/admin/teachers" className="block hover:text-blue-400">
            Учители
          </Link>
          <Link href="/admin/classrooms" className="block hover:text-blue-400">
            Управление Класове
          </Link>
          <Link href="/admin/students" className="block hover:text-blue-400">
            Ученици
          </Link>
          <Link href="/admin/parents" className="block hover:text-blue-400">
            Родители
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
}
