"use client";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/utils/api";
import { useState, useEffect } from "react";

export default function EditStudentPage() {
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
      .get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const s = res.data;
        setForm({
          firstName: s.firstName || "",
          lastName: s.lastName || "",
          email: s.email || "",
        });
      });
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await api.patch(`/users/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/admin/students");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error with update");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-xl text-white">
      <h1 className="text-2xl font-bold mb-4">✏️ Редакция на ученик</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          name="firstName"
          placeholder="Име"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          className="input"
          name="lastName"
          placeholder="Фамилия"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <input
          className="input"
          name="email"
          placeholder="Имейл"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button className="bg-blue-600 px-4 py-2 rounded">Запази</button>
      </form>
    </div>
  );
}
