"use client";

import { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      // ⛳ Пренасочване според ролята
      switch (role) {
        case "SUPERADMIN":
          router.push("/superadmin");
          break;
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "TEACHER":
          router.push("/teacher");
          break;
        case "STUDENT":
          router.push("/student");
          break;
        case "PARENT":
          router.push("/parent");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (error: any) {
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Вход</h1>
      <input
        className="w-full p-2 border mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 border mb-3"
        type="password"
        placeholder="Парола"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded"
        onClick={handleLogin}
      >
        Вход
      </button>
    </div>
  );
}
