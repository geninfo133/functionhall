// components/Topbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, UserCircle, ChevronDown, User, Calendar, LogOut } from "lucide-react";
import { BACKEND_URL } from "../lib/config";

const Topbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch logged-in user info
    fetch(`${BACKEND_URL}/api/check-auth`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data);
        }
      })
      .catch(err => console.error("Error fetching user:", err));
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (search.trim()) {
      router.push(`/home?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/home");
    }
  };

  const handleLogout = () => {
    fetch(`${BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include"
    })
      .then(() => {
        setUser(null);
        router.push("/auth/login");
      })
      .catch(err => console.error("Logout error:", err));
  };

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between rounded-b-2xl">
      {/* Branding/Home Link */}
      <Link href="/home" className="text-2xl font-bold text-orange-500 mr-6">FunctionHall</Link>
      
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
          className="ml-2 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-orange-600 transition"
        >
          Search
        </button>
      </form>
      
      {/* Profile Dropdown */}
      <div className="relative">
        {user ? (
          <>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
            >
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b">
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <div className="py-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">My Profile</span>
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Calendar size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">My Bookings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 transition text-left"
                  >
                    <LogOut size={16} className="text-red-600" />
                    <span className="text-sm text-red-600">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            <UserCircle size={20} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Topbar;


