// components/Topbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, UserCircle } from "lucide-react";

const Topbar: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Redirect to homepage with search query as URL param
    if (search.trim()) {
      router.push(`/home?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/home");
    }
  };
  return (
    <header className="bg-slate-900 shadow-sm p-4 flex items-center justify-between rounded-b-2xl border-b border-slate-700">
      {/* Branding/Home Link */}
      <Link href="/" className="text-2xl font-bold text-slate-300 mr-6">FunctionHall</Link>
      {/* Search Bar */}
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
      {/* Profile/Actions */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/profile" className="text-slate-300 font-semibold hover:text-slate-100">Profile</Link>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 shadow">
          <img 
            src="/G.png" 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;


