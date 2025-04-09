"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/utils/api";

export default function NewParentPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await api.post(
      "/users",
      { email, password, role: "PARENT" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    router.push("/superadmin/parents");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-white">➕ Нов родител</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Имейл"
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Парола"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Създай
        </button>
      </form>
    </div>
  );
}
