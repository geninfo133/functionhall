// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, CalendarDays, LogOut } from "lucide-react";
import { FaTachometerAlt, FaBuilding, FaUsers, FaCog, FaFileInvoice, FaHeadset, FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
  { name: "Function Halls", path: "/dashboard/halls", icon: <Building2 size={18} /> },
  { name: "Bookings", path: "/dashboard/bookings", icon: <CalendarDays size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-slate-900 h-screen shadow-lg flex flex-col p-6 rounded-r-2xl border-r border-slate-700">
      
      <nav className="flex-1">
        <div className="mb-4 px-4">
          <p className="text-lg tracking-wider text-slate-300 font-bold pb-2 border-b-2 border-slate-600" style={{ fontFamily: 'Arial, sans-serif' }}>Navigation Menu</p>
        </div>
        <ul className="space-y-2">
          <li>
            <a href="/admin/customers" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 font-bold transition whitespace-nowrap">
              <FaUsers className="text-slate-400" />
              <span>Customers</span>
            </a>
          </li>
          <li>
            <a href="/admin/halls" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 font-bold transition">
              <FaBuilding className="text-slate-400" />
              <span>Function Halls</span>
            </a>
          </li>
          <li>
            <a href="/admin/enquiries" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 font-bold transition">
              <FaHeadset className="text-slate-400" />
              <span>View Enquiries</span>
            </a>
          </li>
          <li>
            <a href="/admin/bookings" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 font-bold transition">
              <FaFileInvoice className="text-slate-400" />
              <span>Manage Bookings</span>
            </a>
          </li>
          <li>
            <a href="/admin/vendors" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 font-bold transition whitespace-nowrap">
              <FaUserShield className="text-slate-400" />
              <span>Vendors</span>
            </a>
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
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };
  return (
    <>
      <button
        className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition"
        onClick={() => setShow(true)}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-600 bg-opacity-30">
          <div className="bg-blue-600 text-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <span className="text-lg font-semibold mb-4">Are you sure you want to logout?</span>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded-lg bg-white text-blue-600 font-bold border border-blue-600 hover:bg-blue-100 transition"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold border border-blue-600 hover:bg-blue-700 transition"
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
