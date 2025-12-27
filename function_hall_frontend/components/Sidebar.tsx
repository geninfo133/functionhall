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
    <aside className="w-48 h-screen shadow-lg flex flex-col p-6 border-r border-slate-700" style={{ background: '#0d316cff' }}>
      
      <nav className="flex-1">
        <div className="mb-3 px-2">
          <p className="text-xs tracking-wider text-slate-300 font-bold pb-2 border-b-2 border-slate-600 whitespace-nowrap" style={{ fontFamily: 'Arial, sans-serif' }}>Navigation Menu</p>
        </div>
        <ul className="space-y-2">
          <li>
            <a href="/admin/dashboard" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
              <FaTachometerAlt className="text-slate-400" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/admin/enquiries" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
              <FaHeadset className="text-slate-400" />
              <span>Enquiries</span>
            </a>
          </li>
          <li>
            <a href="/customer/enquiry" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
              <FaHeadset className="text-slate-400" />
              <span>Send Enquiry</span>
            </a>
          </li>
          <li>
            <a href="/admin/halls" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
              <FaBuilding className="text-slate-400" />
              <span>Halls</span>
            </a>
          </li>
          <li>
            <a href="/admin/bookings" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
              <FaFileInvoice className="text-slate-400" />
              <span>Bookings</span>
            </a>
          </li>
          <li>
            <a href="/admin/customers-list" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
              <FaUsers className="text-slate-400" />
              <span>Customers</span>
            </a>
          </li>
          <li>
            <a href="/admin/customers-list" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
              <FaUsers className="text-slate-400" />
              <span>Customer List</span>
            </a>
          </li>
          <li>
            <a href="/admin/vendors" className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 text-xs transition whitespace-nowrap">
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
        className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg text-white text-sm transition"
        style={{ background: '#0d316cff' }}
        onClick={() => setShow(true)}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30" style={{ background: 'rgba(13, 49, 108, 0.3)' }}>
          <div className="text-white rounded-xl shadow-lg p-8 flex flex-col items-center" style={{ background: '#0d316cff' }}>
            <span className="text-lg font-semibold mb-4">Are you sure you want to logout?</span>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded-lg bg-white font-bold border transition"
                style={{ color: '#0d316cff', borderColor: '#0d316cff' }}
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg text-white font-bold border transition"
                style={{ background: '#0d316cff', borderColor: '#0d316cff' }}
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
