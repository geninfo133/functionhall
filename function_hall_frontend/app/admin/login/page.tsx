"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL } from "../../../lib/config";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear any existing vendor/customer sessions when admin login page loads
  useEffect(() => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerInfo');
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🔑 Attempting admin login with:", { email, backend: BACKEND_URL });

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", data);

      if (response.ok && data.token) {
        console.log("✅ Admin login successful! Token received");
        console.log("📋 Admin role:", data.admin.role);
        
        // Clear any vendor session data first
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
        
        // Store admin token and admin data in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        
        // Redirect based on role
        if (data.admin.role === 'super_admin') {
          window.location.href = "/admin/dashboard";
        } else if (data.admin.role === 'vendor') {
          // If someone logs in as vendor from admin login page, redirect to vendor dashboard
          localStorage.setItem('vendorToken', data.token);
          localStorage.setItem('vendorData', JSON.stringify(data.admin));
          window.location.href = "/vendor/dashboard";
        } else {
          window.location.href = "/admin/dashboard";
        }
      } else {
        console.error("❌ Login failed:", data.error);
        setError(data.error || "Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("💥 Admin login error:", err);
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">
            Welcome to <span className="font-semibold text-blue-600">GenS Services</span> Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
            >
              {loading ? "Signing in..." : "Sign In as Admin"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Not an admin?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Customer Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected admin area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
