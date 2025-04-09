"use client";
import { useState } from "react";
import { api } from "@/app/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [egn, setEgn] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await api.post(
      "/users",
      { email, password, egn, address, role: "STUDENT" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push("/superadmin/students");
  };

  return (
    <div className="max-w-md mx-auto p-6 text-white bg-zinc-800 rounded-xl">
      <h1 className="text-2xl text-white font-bold mb-4">➕ Нов ученик</h1>
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
        <input
          className="input"
          value={egn}
          onChange={(e) => setEgn(e.target.value)}
          placeholder="ЕГН"
        />
        <input
          className="input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Адрес"
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
