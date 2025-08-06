"use client";
import React, { useState } from "react";

type Props = {};

const page = (props: Props) => {
  const [selectedReport, setSelectedReport] = useState<string>("grades");
  return (
    <div className="p-4 text-white space-y-4">
      <h1 className="text-2xl font-bold">📊 Отчети</h1>

      {/* Табове за избор */}
      <div className="flex gap-2">
        {[
          { label: "Оценки", value: "grades" },
          { label: "Отсъствия", value: "attendance" },
          { label: "Часове", value: "lessons" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedReport(tab.value)}
            className={`px-4 py-2 rounded-md transition ${
              selectedReport === tab.value
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Съдържание според избрания отчет */}
      <div className="bg-gray-800 p-4 rounded-md min-h-[300px]">
        {selectedReport === "grades" && (
          <div>📚 Избери клас и предмет за оценките.</div>
        )}
        {selectedReport === "attendance" && (
          <div>🚪 Отсъствия по клас/ученик.</div>
        )}
        {selectedReport === "lessons" && (
          <div>📅 Преглед на учебни часове.</div>
        )}
      </div>
    </div>
  );
};

export default page;
