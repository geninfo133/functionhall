"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";

export default function AdminSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch(`${BACKEND_URL}/api/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Admin registered successfully! Please login.");
      setTimeout(() => router.push("/auth/login"), 1500);
    } else {
      setError(data.error || "Registration failed.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSignup} className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Admin Registration</h1>
        {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 font-semibold text-center">{success}</div>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 rounded-lg border bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow">Register</button>
        <div className="mt-4 text-center text-sm text-gray-700">
          Already have an account? <a href="/auth/login" className="text-orange-600 font-semibold hover:underline">Login</a>
        </div>
      </form>
    </main>
  );
}
