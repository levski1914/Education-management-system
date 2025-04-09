import Link from "next/link";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">🛡️ SUPER ADMIN</h2>
        <nav className="space-y-2">
          <Link href="/superadmin" className="block hover:text-blue-400">
            Dashboard
          </Link>
          <Link
            href="/superadmin/schools"
            className="block hover:text-blue-400"
          >
            Schools
          </Link>
          <Link
            href="/superadmin/teachers"
            className="block hover:text-blue-400"
          >
            Teachers
          </Link>
          <Link
            href="/superadmin/students"
            className="block hover:text-blue-400"
          >
            Students
          </Link>
          <Link
            href="/superadmin/parents"
            className="block hover:text-blue-400"
          >
            Parents
          </Link>
          <Link
            href="/superadmin/reports"
            className="block hover:text-blue-400"
          >
            Reports
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
}
