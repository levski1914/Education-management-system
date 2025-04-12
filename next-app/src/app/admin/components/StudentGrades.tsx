"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/utils/api";

export function StudentGrades({ studentId }: { studentId: string }) {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchGrades = async () => {
      const res = await api.get(`/students/${studentId}/grades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🎓 Grades data:", res.data);
      setGrades(res.data);
    };

    fetchGrades();
  }, [studentId]);
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Оценки</h2>
      {grades.length === 0 ? (
        <p>Няма оценки</p>
      ) : (
        <ul className="space-y-1">
          {grades.map((g) => (
            <li key={g.id}>
              {g.subject.name}: {g.value} –{" "}
              {new Date(g.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
