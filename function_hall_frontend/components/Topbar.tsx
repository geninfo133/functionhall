// components/Topbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, UserCircle, Home, Building2, CalendarDays } from "lucide-react";
import { FaTachometerAlt, FaBuilding, FaUsers, FaFileInvoice, FaHeadset, FaUserShield } from "react-icons/fa";

import { usePathname } from "next/navigation";

const Topbar: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Redirect to homepage with search query as URL param
    if (search.trim()) {
      router.push(`/home?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/home");
    }
  };
  const isAdminProfile = pathname === "/admin/profile";
  return (
    <header className="bg-slate-900 shadow-sm p-4 flex items-center justify-between rounded-b-2xl border-b border-slate-700">
      {/* Branding/Home Link */}
      <Link href="/" className="text-2xl font-bold text-slate-300 mr-6">FunctionHall</Link>
      {/* Search Bar */}
      {!isAdminProfile && (
        <form className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full shadow-sm w-96" onSubmit={handleSearch}>
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search halls by name or location"
            className="outline-none text-sm w-full bg-transparent text-slate-300 placeholder-slate-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-slate-700 text-white px-3 py-1 rounded-full font-semibold hover:bg-slate-600 transition"
          >
            Search
          </button>
        </form>
      )}
      {/* Profile/Actions */}
      {!isAdminProfile && (
        <div className="flex items-center space-x-4">
          {/* All navigation links from Sidebar */}
          <Link href="/admin/dashboard" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaTachometerAlt className="text-slate-400" /><span>Dashboard</span></Link>
          <Link href="/admin/enquiries" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaHeadset className="text-slate-400" /><span>View Enquiries</span></Link>
          <Link href="/customer/enquiry" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaHeadset className="text-slate-400" /><span>Send Enquiry</span></Link>
          <Link href="/admin/halls" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaBuilding className="text-slate-400" /><span>Function Halls</span></Link>
          <Link href="/admin/bookings" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaFileInvoice className="text-slate-400" /><span>Manage Bookings</span></Link>
          <Link href="/admin/customers" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaUsers className="text-slate-400" /><span>Customers</span></Link>
          <Link href="/admin/customers-list" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaUsers className="text-slate-400" /><span>Customer List</span></Link>
          <Link href="/admin/vendors" className="text-slate-300 font-semibold hover:text-slate-100 flex items-center space-x-1"><FaUserShield className="text-slate-400" /><span>Vendors</span></Link>
          {/* Profile and avatar */}
          <Link href="/admin/profile" className="text-slate-300 font-semibold hover:text-slate-100">Profile</Link>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 shadow">
            <img 
              src="/G.png" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;


