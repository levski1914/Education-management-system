"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/utils/api";

export default function NewTeacherPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    await api.post(
      "/users",
      { email, password, role: "TEACHER" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push("/superadmin/teachers");
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-800 p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">➕ Добави учител</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Имейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white"
        />
        <input
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white"
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
