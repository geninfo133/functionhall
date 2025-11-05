"use client";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { FaUsers, FaBuilding, FaClipboardList, FaRupeeSign } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

export default function AdminDashboard() {
  // Dummy stats for now; replace with real API data later
  const stats = [
    { label: "Total Halls", value: 12, icon: <FaBuilding className="text-blue-700 text-3xl" /> },
    { label: "Total Bookings", value: 34, icon: <FaClipboardList className="text-green-600 text-3xl" /> },
    { label: "Total Customers", value: 20, icon: <FaUsers className="text-purple-600 text-3xl" /> },
    { label: "Revenue", value: "₹1,20,000", icon: <FaRupeeSign className="text-yellow-600 text-3xl" /> },
  ];
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 text-white rounded-2xl shadow-lg px-8 py-6 mb-10 animate-fade-in">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 drop-shadow">Welcome, Admin!</h1>
              <p className="text-lg font-medium opacity-90">Manage your function halls, bookings, and more with ease.</p>
            </div>
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-white text-6xl drop-shadow" />
              <span className="text-xl font-bold">Admin</span>
            </div>
          </div>
          {/* Stat Cards with Glassmorphism and Hover Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, idx) => (
              <div key={stat.label} className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 p-6 transition-transform duration-200 hover:scale-105 hover:bg-white/80">
                <div>{stat.icon}</div>
                <div>
                  <div className="text-3xl font-extrabold text-blue-900 drop-shadow">{stat.value}</div>
                  <div className="text-gray-700 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Quick Links with Glassmorphism and Icon Animation */}
          <nav className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/halls" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-blue-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-blue-900 flex items-center gap-2"><FaBuilding className="text-blue-700 animate-bounce" /> Manage Halls</span>
              <p className="text-gray-600 mt-2">Add, edit, or delete function halls.</p>
            </Link>
            <Link href="/admin/packages" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-green-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-blue-900 flex items-center gap-2"><FaClipboardList className="text-green-600 animate-bounce" /> Manage Packages</span>
              <p className="text-gray-600 mt-2">Edit packages for each hall.</p>
            </Link>
            <Link href="/admin/bookings" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-purple-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-blue-900 flex items-center gap-2"><FaClipboardList className="text-green-600 animate-bounce" /> Manage Bookings</span>
              <p className="text-gray-600 mt-2">View and update all bookings.</p>
            </Link>
            <Link href="/admin/customers" className="block backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 hover:bg-pink-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-xl font-semibold text-blue-900 flex items-center gap-2"><FaUsers className="text-purple-600 animate-bounce" /> Manage Customers</span>
              <p className="text-gray-600 mt-2">View and manage customer details.</p>
            </Link>
          </nav>
          <section className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Get Started</h2>
            <p className="text-gray-700">Use the quick links above to manage halls, packages, bookings, and customers. More features coming soon!</p>
          </section>
        </main>
      </div>
    </div>
  );
}
