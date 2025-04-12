"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/utils/api";

export default function EditTeacherPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error("❌ Error loading teacher", err);
        alert("Грешка при зареждане");
        router.push("/admin/teachers");
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await api.patch(`/users/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/admin/teachers");
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Грешка при обновяване");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-xl text-white">
      <h1 className="text-2xl font-bold mb-4">✏️ Редактирай учител</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="firstName"
          className="input"
          placeholder="Име"
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          className="input"
          placeholder="Фамилия"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          name="email"
          className="input"
          placeholder="Имейл"
          value={form.email}
          onChange={handleChange}
        />
        <button className="bg-blue-600 px-4 py-2 rounded">Запази</button>
      </form>
    </div>
  );
}
