import { api } from "./api";

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const res = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Not authenticated");
    return null;
  }
}
