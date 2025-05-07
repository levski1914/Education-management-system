"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/app/utils/api";
import { StudentGrades } from "@/app/admin/components/StudentGrades";
import { StudentAttendance } from "@/app/admin/components/StudentAttendance";
import { StudentFiles } from "../components/StudentFiles";

export default function StudentProfileModal({
  studentId,
  onClose,
}: {
  studentId: string;
  onClose: () => void;
}) {
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "info" | "grades" | "attendance" | "documents"
  >("info");
  const [alerts, setAlerts] = useState<string[]>([]);
  const [hasWarnings, setHasWarnings] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // затваря модала
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!studentId) return;

    api
      .get(`/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data));
    api
      .get(`/students/${studentId}/warnings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHasWarnings(res.data.hasWarnings));
    api
      .get(`/students/${studentId}/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAlerts(res.data));
  }, [studentId]);

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            📁 Досие на {student.firstName} {student.lastName}
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            ✖
          </button>
        </div>

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

          {activeTab === "grades" && <StudentGrades studentId={studentId} />}
          {activeTab === "attendance" && (
            <StudentAttendance studentId={studentId} />
          )}
          {activeTab === "documents" && <StudentFiles studentId={studentId} />}
        </div>
      </div>
    </div>
  );
}
