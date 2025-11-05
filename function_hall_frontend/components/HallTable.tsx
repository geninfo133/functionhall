// components/HallTable.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import { getHalls } from "../lib/data";


export default function HallTable() {
  const [halls, setHalls] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/halls")
      .then(res => res.json())
      .then(data => setHalls(data));
  }, []);

  // Color palette for initials
  const colors = [
    "bg-blue-500", "bg-red-500", "bg-purple-500", "bg-green-500", "bg-pink-500", "bg-yellow-500", "bg-teal-500", "bg-blue-400", "bg-purple-400", "bg-red-400", "bg-blue-600", "bg-green-400"
  ];

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Fnction Halls</h2>
        <span className="text-gray-500 text-sm">{halls.length} Function Halls</span>
      </div>
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-8 py-4 font-semibold tracking-wide">Name</th>
              <th className="px-8 py-4 font-semibold tracking-wide">Location</th>
              <th className="px-8 py-4 font-semibold tracking-wide">Capacity</th>
              <th className="px-8 py-4 font-semibold tracking-wide">Contact number</th>
              <th className="px-8 py-4 font-semibold tracking-wide">Price</th>
            </tr>
          </thead>
          <tbody>
            {halls.map((hall, idx) => (
              <tr key={hall.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-8 py-4 flex items-center space-x-3">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-white font-bold text-base ${colors[idx % colors.length]}`}>{hall.name[0]}</span>
                  <Link href={`/halls/${hall.id}`} className="font-medium text-blue-700 hover:underline">{hall.name}</Link>
                </td>
                <td className="px-8 py-4">{hall.location}</td>
                <td className="px-8 py-4">{hall.capacity}</td>
                <td className="px-8 py-4">{hall.contact_number}</td>
                <td className="px-8 py-4">₹{hall.price_per_day}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
