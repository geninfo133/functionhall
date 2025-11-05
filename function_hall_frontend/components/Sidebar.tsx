// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, CalendarDays, LogOut } from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { name: "Function Halls", path: "/dashboard/halls", icon: <Building2 size={18} /> },
  { name: "Bookings", path: "/dashboard/bookings", icon: <CalendarDays size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col p-6 rounded-r-2xl">
      <div className="mb-10 flex items-center space-x-2">
        <img src="/31530356_bird_2.jpg" alt="Logo" className="w-8 h-8" />
        <span className="text-2xl font-bold text-blue-700 tracking-tight">GenS Services</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition">Dashboard</a>
          </li>
          <li>
            <a href="/dashboard/halls" className="block px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold shadow">Function Halls</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition">Manage Roles</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition">System Features</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition">Billing</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition">Support Request</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition">Settings</a>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <button className="w-full py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition">Logout</button>
      </div>
    </aside>
  );
}
