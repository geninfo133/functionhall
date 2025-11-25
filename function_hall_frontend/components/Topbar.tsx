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
    <header className="bg-white shadow-sm p-4 flex items-center justify-between rounded-b-2xl">
      {/* Branding/Home Link */}
      <Link href="/" className="text-2xl font-bold text-orange-500 mr-6">FunctionHall</Link>
      {/* Search Bar */}
      <form className="flex items-center space-x-2 bg-gray-100 border px-4 py-2 rounded-full shadow-sm w-96" onSubmit={handleSearch}>
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search halls by name or location"
          className="outline-none text-sm w-full bg-transparent"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-orange-500 transition"
        >
          Search
        </button>
      </form>
      {/* Profile/Actions */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/profile" className="text-orange-500 font-semibold hover:underline">Profile</Link>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 shadow">
          <img 
            src="/hani1.jpg" 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;


