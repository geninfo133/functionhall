
// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, CalendarDays, LogOut } from "lucide-react";
import { useState } from "react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { name: "Function Halls", path: "/dashboard/halls", icon: <Building2 size={18} /> },
  { name: "Bookings", path: "/dashboard/bookings", icon: <CalendarDays size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col p-6 rounded-r-2xl border-r border-gray-200">
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="block w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-gray-800 font-medium transition">Dashboard</a>
          </li>
          <li>
            <a href="/dashboard/halls" className="block w-full px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow">Function Halls</a>
          </li>
          <li>
            <a href="#" className="block w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-gray-800 font-medium transition">Manage Roles</a>
          </li>
          <li>
            <a href="#" className="block w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-gray-800 font-medium transition">System Features</a>
          </li>
          <li>
            <a href="#" className="block w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-gray-800 font-medium transition">Billing</a>
          </li>
          <li>
            <a href="#" className="block w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-gray-800 font-medium transition">Support Request</a>
          </li>
          <li>
            <a href="#" className="block w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-gray-800 font-medium transition">Manage Customers</a>
          </li>
          <li>
            <a href="#" className="block w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-gray-800 font-medium transition">Settings</a>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
}

function LogoutButton() {
  const [show, setShow] = useState(false);
  const handleLogout = () => {
    // TODO: Add your logout logic here
    setShow(false);
  };
  return (
    <>
      <button
        className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-500 text-white font-bold transition"
        onClick={() => setShow(true)}
      >
        Logout
      </button>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-orange-500 bg-opacity-30">
          <div className="bg-orange-500 text-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <span className="text-lg font-semibold mb-4">Are you sure you want to logout?</span>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded-lg bg-white text-orange-500 font-bold border border-orange-500 hover:bg-orange-100 transition"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-orange-500 text-white font-bold border border-orange-500 hover:bg-orange-600 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
