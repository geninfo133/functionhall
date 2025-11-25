"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { BACKEND_URL } from "../../../lib/config";
import { FaUsers, FaBuilding, FaClipboardList, FaRupeeSign } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    console.log("🔍 Admin Dashboard: Checking authentication...");
    // Check admin authentication
    fetch(`${BACKEND_URL}/api/admin/check-auth`, {
      credentials: "include"
    })
      .then(res => {
        console.log("📡 Admin auth check response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("📦 Admin auth check data:", data);
        if (!data.authenticated) {
          console.log("❌ Not authenticated, redirecting to admin login");
          router.push("/admin/login");
        } else {
          console.log("✅ Admin authenticated:", data.name);
          setAdmin(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("💥 Auth check error:", err);
        router.push("/admin/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-500"></div>
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Dummy stats for now; replace with real API data later
  const stats = [
    { label: "Total Halls", value: 12, icon: <FaBuilding className="text-orange-600 text-3xl" /> },
    { label: "Total Bookings", value: 34, icon: <FaClipboardList className="text-orange-400 text-3xl" /> },
    { label: "Total Customers", value: 20, icon: <FaUsers className="text-orange-300 text-3xl" /> },
    { label: "Revenue", value: "₹1,20,000", icon: <FaRupeeSign className="text-orange-500 text-3xl" /> },
  ];
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="flex items-center justify-between bg-orange-500 text-white rounded-2xl shadow-lg px-8 py-6 mb-10 animate-fade-in">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 drop-shadow">Welcome, {admin?.name || 'Admin'}!</h1>
              <p className="text-lg font-medium opacity-90">Manage your function halls, bookings, and more with ease.</p>
            </div>
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-orange-500 bg-white rounded-full text-6xl drop-shadow p-1" />
              <span className="text-xl font-bold">{admin?.role || 'Admin'}</span>
            </div>
          </div>
          {/* Stat Cards with Glassmorphism and Hover Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, idx) => (
              <div key={stat.label} className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 p-6 transition-transform duration-200 hover:scale-105 hover:bg-orange-50">
                <div>{stat.icon}</div>
                <div>
                  <div className="text-3xl font-extrabold text-orange-700 drop-shadow">{stat.value}</div>
                  <div className="text-gray-700 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Quick Links with Glassmorphism and Icon Animation */}
          <nav className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/halls" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-orange-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-orange-700 flex items-center gap-2"><FaBuilding className="text-orange-600 animate-bounce" /> Manage Halls</span>
              <p className="text-gray-600 mt-2">Add, edit, or delete function halls.</p>
            </Link>
            <Link href="/admin/packages" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-orange-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-orange-700 flex items-center gap-2"><FaClipboardList className="text-orange-400 animate-bounce" /> Manage Packages</span>
              <p className="text-gray-600 mt-2">Edit packages for each hall.</p>
            </Link>
            <Link href="/admin/bookings" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-orange-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-orange-700 flex items-center gap-2"><FaClipboardList className="text-orange-400 animate-bounce" /> Manage Bookings</span>
              <p className="text-gray-600 mt-2">View and update all bookings.</p>
            </Link>
            <Link href="/admin/customers" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-orange-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-orange-700 flex items-center gap-2"><FaUsers className="text-orange-500 animate-bounce" /> Manage Customers</span>
              <p className="text-gray-600 mt-2">View and manage customer details.</p>
            </Link>
          </nav>
          <section className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Get Started</h2>
            <p className="text-gray-700">Use the quick links above to manage halls, packages, bookings, and customers. More features coming soon!</p>
          </section>
        </main>
      </div>
    </div>
  );
}
