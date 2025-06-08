"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/app/utils/api";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  extraEmail?: string;
  profilePic: string;
};

export default function TeacherProfile() {
  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
    extraEmail: "",
    profilePic: "",
  });
  const [editData, setEditData] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
    extraEmail: "",
    profilePic: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data); // Само за показване
      // Не пълним editData!
    } catch {
      toast.error("❌ Грешка при зареждане на профила.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      // Изпращаме само попълнените полета
      const payload: Partial<Profile> = {};
      if (editData.firstName) payload.firstName = editData.firstName;
      if (editData.lastName) payload.lastName = editData.lastName;
      if (editData.extraEmail) payload.extraEmail = editData.extraEmail;
      if (editData.profilePic) payload.profilePic = editData.profilePic;

      await api.put("/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Профилът е обновен успешно.");
      fetchProfile(); // рефрешва дясната страна
      setEditData({
        firstName: "",
        lastName: "",
        email: "",
        extraEmail: "",
        profilePic: "",
      }); // чистим полетата след запис
    } catch {
      toast.error("❌ Неуспешна актуализация.");
    }
  };

  if (loading) return <p>Зареждане...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">👤 Моите данни</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Лява колона - форма */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Редакция</h3>

          <label className="block text-sm font-medium">Име</label>
          <input
            type="text"
            value={editData.firstName}
            onChange={(e) =>
              setEditData({ ...editData, firstName: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block text-sm font-medium">Фамилия</label>
          <input
            type="text"
            value={editData.lastName}
            onChange={(e) =>
              setEditData({ ...editData, lastName: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block text-sm font-medium">
            Допълнителен имейл
          </label>
          <input
            type="email"
            value={editData.extraEmail || ""}
            onChange={(e) =>
              setEditData({ ...editData, extraEmail: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block text-sm font-medium">Снимка (линк)</label>
          <input
            type="text"
            value={editData.profilePic}
            onChange={(e) =>
              setEditData({ ...editData, profilePic: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            💾 Запази
          </button>
        </div>

        {/* Дясна колона - информация */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Текуща информация</h3>

          <div className="mb-4">
            <strong>Име:</strong> {profile.firstName || "—"}
          </div>
          <div className="mb-4">
            <strong>Фамилия:</strong> {profile.lastName || "—"}
          </div>
          <div className="mb-4">
            <strong>Служебен имейл:</strong> {profile.email}
          </div>
          <div className="mb-4">
            <strong>Допълнителен имейл:</strong> {profile.extraEmail || "—"}
          </div>
          {profile.profilePic && (
            <img
              src={profile.profilePic}
              alt="Снимка"
              className="w-24 h-24 rounded-full mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
