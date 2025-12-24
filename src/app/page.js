"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`,
          {
            headers: {
              token: `Bearer ${token}`,
            }
          }
        );
        console.log(res , 'resp')
        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        router.replace("/dashboard");
      } catch (err) {
        console.log(err , 'error')
        // localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    checkAuth();

    return () => controller.abort();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center text-gray-500">
      Checking authentication...
    </div>
  );
}
