"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Always clear fields on mount
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);
  const [error, setError] = useState("");
  const router = useRouter();

  // Real login function
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        console.log("Login successful, data:", data);
        
        // Small delay to ensure cookie is set before redirect
        setTimeout(() => {
          router.push("/home");
        }, 100);
      } else {
        setError(data.error || "Invalid credentials.");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to server.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">
          Welcome to <span className="text-blue-900">Gen<span className="text-orange-600">150</span></span> Services
        </h1>
        {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}
        <form onSubmit={handleLogin} autoComplete="off" className="grid grid-cols-1 gap-4">
          <label className="text-sm text-gray-700 font-medium">Enter email ID or contact number</label>
          <input
            type="email"
            placeholder="Enter email ID or contact number"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-blue-50"
            required
            autoComplete="new-email"
            name="email"
          />
          <label className="text-sm text-gray-700 font-medium">Enter password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-blue-50"
            required
            autoComplete="new-password"
            name="password"
          />
          <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition mt-2">Login</button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-gray-500 text-sm hover:underline">Forgot password?</a>
        </div>
        <div className="mt-2 text-center text-sm">
          New here? <a href="/auth/signup" className="text-orange-600 font-semibold hover:underline">Register
          </a>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm">
          <a href="/admin/login" className="text-gray-600 hover:text-orange-600 font-medium transition">
            🔐 Admin Portal
          </a>
        </div>
      </div>
    </main>
  );
}
