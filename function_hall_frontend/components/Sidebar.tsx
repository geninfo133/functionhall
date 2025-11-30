
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
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col p-6 rounded-r-2xl border-r border-gray-200">
      
      <nav className="flex-1">
        <div className="mb-4 px-4">
          <p className="text-lg tracking-wider text-orange-500 font-bold pb-2 border-b-2 border-orange-500" style={{ fontFamily: 'Arial, sans-serif' }}>Navigation Menu</p>
        </div>
        <ul className="space-y-2">
          <li>
            <a href="/admin/dashboard" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaTachometerAlt className="text-orange-500" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/admin/enquiries" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaHeadset className="text-orange-500" />
              <span>Enquiries</span>
            </a>
          </li>
          <li>
            <a href="/dashboard/halls" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaBuilding className="text-orange-500" />
              <span>Function Halls</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaUserShield className="text-orange-500" />
              <span>Manage Roles</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaCog className="text-orange-500" />
              <span>System Features</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaFileInvoice className="text-orange-500" />
              <span>Billing</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaHeadset className="text-orange-500" />
              <span>Support Request</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaUsers className="text-orange-500" />
              <span>Manage Customers</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white text-blue-700 font-bold transition">
              <FaCog className="text-orange-500" />
              <span>Settings</span>
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
    // TODO: Add your logout logic here
    setShow(false);
  };
  return (
    <>
      <button
        className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition"
        onClick={() => setShow(true)}
      >
        <FaSignOutAlt />
        <span>Logout</span>
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
