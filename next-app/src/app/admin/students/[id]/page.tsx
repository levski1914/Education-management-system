"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/app/utils/api";
import { StudentGrades } from "../../components/StudentGrades";
import { StudentAttendance } from "../../components/StudentAttendance";
import { StudentFiles } from "../../components/StudentFiles";

export default function StudentProfilePage() {
  const { id } = useParams(); // взимаме studentId от URL
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "info" | "grades" | "attendance" | "documents"
  >("info");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get(`/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data));
  }, [id]);

  if (!student)
    return (
      <>
        <div className="flex h-full justify-center items-center">
          <div className="loader">
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__ball"></div>
          </div>
        </div>
      </>
    );

  return (
    <div className="p-6 text-black space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        📁 Досие на {student.firstName} {student.lastName}
      </h1>

      {/* ТАБОВЕ */}
      <div className="flex gap-4 border-b border-zinc-300 pb-2">
        {[
          { key: "info", label: "👤 Профил" },
          { key: "grades", label: "🎓 Оценки" },
          { key: "attendance", label: "✅ Присъствия" },
          { key: "documents", label: "📁 Документи" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-1 cursor-pointer rounded-t font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow"
                : "hover:bg-zinc-600 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* СЪДЪРЖАНИЕ */}
      <div className="mt-4">
        {activeTab === "info" && (
          <div className="space-y-2">
            <p>
              <strong>Имейл:</strong> {student.email}
            </p>
            <p>
              <strong>Клас:</strong> {student.class?.name || "—"}
            </p>
            <p>
              <strong>Училище:</strong> {student.school?.name || "—"}
            </p>
          </div>
        )}

        {activeTab === "grades" && <StudentGrades studentId={id as string} />}

        {activeTab === "attendance" && (
          <StudentAttendance studentId={id as string} />
        )}
        {activeTab === "documents" && <StudentFiles studentId={id as string} />}
      </div>
    </div>
  );
}
