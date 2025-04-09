"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withRoleProtection(Component: any, allowedRoles: string[]) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(userStr);
      if (!allowedRoles.includes(user.role)) {
        router.push("/dashboard"); // или /unauthorized
        return;
      }

      setLoading(false);
    }, []);

    if (loading) return <p className="text-white">Зареждане...</p>;

    return <Component {...props} />;
  };
}
