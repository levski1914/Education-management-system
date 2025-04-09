"use client";
import { useState, useEffect } from "react";
import { api } from "@/app/utils/api";
import { useRouter, useParams } from "next/navigation";

export default function EditTeacher() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmail(res.data.email);
      });
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await api.put(
      `/users/${id}`,
      {
        email,
        ...(password && { password }),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.push("/superadmin/teachers");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">✏️ Редактирай учител</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Нова парола (по избор)"
          className="w-full p-2 rounded bg-zinc-700 text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Запази промените
        </button>
      </form>
    </div>
  );
}
