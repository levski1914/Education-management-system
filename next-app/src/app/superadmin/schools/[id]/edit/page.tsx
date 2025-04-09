"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";
import { useParams, useRouter } from "next/navigation";

export default function EditSchool() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get(`/schools/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setName(res.data.name);
        setCity(res.data.city);
      });
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    await api.put(
      `/schools/${id}`,
      { name, city },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push("/superadmin/schools");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-xl">
      <h1 className="text-2xl font-bold mb-4">✏️ Редактирай училище</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Запази
        </button>
      </form>
    </div>
  );
}
