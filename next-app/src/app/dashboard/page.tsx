"use client";
import { useEffect, useState } from "react";
import RoleSwitcher from "../components/RoleSwitcher";
import { getCurrentUser } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((data) => {
      if (!data) {
        router.push("/login");
      } else {
        setUser(data);
      }
    });
  }, []);

  if (!user) return <p className="text-center p-8">Loading///</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Добре дошъл, {user.role}!</h1>
      <RoleSwitcher role={user.role} />
    </div>
  );
}
