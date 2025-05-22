import { toast } from "react-toastify";
import { api } from "./api";

export const checkServerHealth = async () => {
  toast.info("Свързване със сървъра...");

  try {
    const res = await api.get("/health/status");

    setTimeout(() => {
      if (res.data?.status === "ok") {
        toast.success("✅ Системата е активна и работи нормално.");
      } else {
        toast.warning("⚠️ Получен отговор, но не както се очаква.");
      }
    }, 3500); // след 1.5 сек
  } catch (error) {
    setTimeout(() => {
      toast.error(
        "❌ Възникна проблем със сървъра. Моля, опитайте по-късно. Нашите специалисти работят!"
      );
    }, 1500);
  }
};
