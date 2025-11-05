// components/Topbar.tsx
"use client";

import { Search, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between rounded-b-2xl">
      <div className="flex items-center space-x-2 bg-gray-100 border px-4 py-2 rounded-full shadow-sm w-96">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search for clients, insights, etc."
          className="outline-none text-sm w-full bg-transparent"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-orange-600 transition">Schedule call</button>
        <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold shadow hover:bg-orange-200 transition">Add client</button>
        <UserCircle size={32} className="text-gray-500" />
      </div>
    </header>
  );
}
