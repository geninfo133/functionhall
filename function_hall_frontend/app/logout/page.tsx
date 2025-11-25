"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetch(`${BACKEND_URL}/api/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Always redirect to login page after logout
        router.push("/auth/login");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}
