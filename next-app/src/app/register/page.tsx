"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";

export default function RegisterSchoolPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolCity, setSchoolCity] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await api.post("/users/register-director", {
      email,
      password,
      schoolName,
      schoolCity,
    });
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 text-white rounded-xl">
      <h1 className="text-2xl font-bold mb-4">📘 Регистрация на училище</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          placeholder="Имейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="input"
          placeholder="Име на училище"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Град"
          value={schoolCity}
          onChange={(e) => setSchoolCity(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded text-white w-full"
        >
          Създай училище и акаунт
        </button>
      </form>
    </div>
  );
}
