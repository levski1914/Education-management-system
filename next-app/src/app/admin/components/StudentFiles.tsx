"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/utils/api";

export function StudentFiles({ studentId }: { studentId: string }) {
  const [files, setFiles] = useState<any[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/students/${studentId}/files`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFiles(res.data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    const token = localStorage.getItem("token");
    await api.post(`/students/${studentId}/files`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    fetchFiles();
    if (fileInput.current) fileInput.current.value = "";
  };

  const deleteFile = async (fileId: string) => {
    const token = localStorage.getItem("token");
    await api.delete(`/students/${studentId}/files/${fileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">📁 Документи</h2>

      <input
        type="file"
        ref={fileInput}
        onChange={handleUpload}
        className="text-sm"
      />

      {files.length === 0 ? (
        <p className="text-sm text-zinc-500">Няма качени файлове</p>
      ) : (
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between border-b pb-1"
            >
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {f.name}
              </a>
              <button
                onClick={() => deleteFile(f.id)}
                className="bg-red-600 px-2 py-1 text-white rounded text-xs"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
