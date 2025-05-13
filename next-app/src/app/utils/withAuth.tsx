"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component: any, allowedRoles: string[]) {
  return function ProtectedComponent(props: any) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user.role || !allowedRoles.includes(user.role)) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <div className="p-6">🔐 Проверка на достъп...</div>;

    return <Component {...props} />;
  };
}
