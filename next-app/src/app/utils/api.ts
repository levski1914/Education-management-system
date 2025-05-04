import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});
export const getParentLog = (studentId: string, token: string) => {
  return api.get(`/users/${studentId}/parent-log`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
