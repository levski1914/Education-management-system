"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/utils/api";

export default function NewSchoolPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    await api.post(
      "/schools",
      { name, city },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    router.push("/superadmin/schools");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">➕ Добави ново училище</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Име на училището"
          className="w-full p-2 rounded bg-zinc-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Град"
          className="w-full p-2 rounded bg-zinc-700 text-white"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded text-white"
        >
          Създай
        </button>
      </form>
    </div>
  );
}
