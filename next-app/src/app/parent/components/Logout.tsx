"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    window.confirm("Сигурен ли си?");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white cursor-pointer bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
    >
      Изход
    </button>
  );
}
