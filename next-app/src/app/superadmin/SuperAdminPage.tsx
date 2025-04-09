"use client";

import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function SuperAdminPage() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/schools", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSchools(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📊 Обща статистика</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-800 rounded-xl shadow">
          👨‍🎓 Students: <strong>52,375</strong>
        </div>
        <div className="p-4 bg-zinc-800 rounded-xl shadow">
          👨‍🏫 Teachers: <strong>3,982</strong>
        </div>
        <div className="p-4 bg-zinc-800 rounded-xl shadow">
          🏫 Schools: <strong>1,245</strong>
        </div>
        <div className="p-4 bg-zinc-800 rounded-xl shadow">
          📝 Grades: <strong>8,641</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-800 p-4 rounded-xl h-64">
          <h2 className="text-xl mb-2">🗺️ Map of schools</h2>
          <div className="h-full bg-zinc-700 rounded flex items-center justify-center text-zinc-400">
            [Map Coming Soon]
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-xl">
          <h2 className="text-xl mb-2">📨 Pending Requests</h2>
          <p className="text-zinc-400">No new requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-800 p-4 rounded-xl">
          <h2 className="text-xl mb-2">🐞 Bug Reports</h2>
          <p className="text-zinc-400">All systems functional</p>
        </div>

        <div className="bg-zinc-800 p-4 rounded-xl">
          <h2 className="text-xl mb-2">📈 Statistics</h2>
          <p className="text-zinc-400">Active users: 5,000+</p>
        </div>
      </div>
    </div>
  );
}
