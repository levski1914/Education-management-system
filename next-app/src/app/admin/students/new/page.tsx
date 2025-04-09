"use client";

import { useState } from "react";
import { api } from "@/app/utils/api";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/users",
        {
          firstName,
          lastName,
          email,
          password,
          role: "STUDENT",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/admin/students");
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Грешка при създаване на ученик");
    }
  };

  return (
    <div className="max-w-md text-white mx-auto p-6 bg-zinc-800 rounded-xl">
      <h1 className="text-2xl text-white font-bold mb-4">➕ Нов ученик</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          placeholder="Име"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Имейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Парола"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-600 px-4 py-2 rounded text-white">
          Създай ученик
        </button>
      </form>
    </div>
  );
}
