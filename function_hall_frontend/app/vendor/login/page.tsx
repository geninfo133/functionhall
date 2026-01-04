"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL } from "../../../lib/config";

export default function VendorLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user data
        localStorage.setItem("vendorToken", data.token);
        localStorage.setItem("vendorData", JSON.stringify(data.admin));
        
        // Redirect to vendor dashboard with full page reload
        window.location.href = "/vendor/dashboard";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#20056a] mb-2">Vendor Login</h1>
          <p className="text-gray-600">Access your vendor dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
              placeholder="vendor@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#20056a] hover:bg-[#150442] text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/vendor/register" className="text-[#20056a] hover:text-[#20056a] font-medium">
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
