"use client";
import { useState, useEffect } from "react";
import { api } from "@/app/utils/api";
import { useRouter, useParams } from "next/navigation";

export default function StudentEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [egn, setEgn] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const s = res.data;
        setEmail(s.email);
        setFirstName(s.firstName || "");
        setLastName(s.lastName || "");
        setEgn(s.egn || "");
        setAddress(s.address || "");
      });
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await api.put(
      `/users/${id}`,
      {
        email,
        firstName,
        lastName,
        egn,
        address,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.push("/superadmin/students");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-xl text-white">
      <h1 className="text-2xl font-bold mb-4">✏️ Редактирай ученик</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Имейл"
        />
        <input
          className="input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Име"
        />
        <input
          className="input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Фамилия"
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
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
          Запази
        </button>
      </form>
    </div>
  );
}
