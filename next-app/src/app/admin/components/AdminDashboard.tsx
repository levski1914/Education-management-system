"use client";
import { useState, useEffect } from "react";
import { api } from "@/app/utils/api";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [school, setSchool] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("USER:", user);
    console.log("TOKEN:", token);

    if (user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    api
      .get("/users/dashboard-data", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("DASHBOARD DATA:", res.data);
        setSchool(res.data.school);
        setStats(res.data.stats);
      })
      .catch((err) => {
        console.error(
          "🔥 DASHBOARD FETCH ERROR:",
          err.response?.data || err.message
        );
      });
  }, []);

  if (!school || !stats) return <p className="text-white">Loading.....</p>;

  return (
    <div className=" space-y-4 ">
      <h1 className="text-2xl text-gray-800 font-bold">
        🏫 Училище: {school.name} – {school.city}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-800 rounded-xl shadow">
          👨‍🏫 Учители: <strong>{stats.teachers}</strong>
        </div>
        <div className="p-4 bg-zinc-800 rounded-xl shadow">
          👨‍🎓 Ученици: <strong>{stats.students}</strong>
        </div>
        <div className="p-4 bg-zinc-800 rounded-xl shadow">
          👨‍👩‍👧 Родители: <strong>{stats.parents}</strong>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/admin/teachers")}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          ➕ Добави учител
        </button>
        <button
          onClick={() => router.push("/admin/students")}
          className="bg-green-600 px-4 py-2 rounded"
        >
          ➕ Добави ученик
        </button>
      </div>
    </div>
  );
}
