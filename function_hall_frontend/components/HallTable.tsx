// components/HallTable.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BACKEND_URL } from "../lib/config";



type HallTableProps = {
  halls?: any[];
  loading?: boolean;
  onEdit?: (hall: any) => void;
  onDelete?: (hall: any) => void;
};

export default function HallTable({ halls: propHalls, loading: propLoading, onEdit, onDelete }: HallTableProps) {
  const [halls, setHalls] = useState<any[]>(propHalls || []);
  const [loading, setLoading] = useState<boolean>(propLoading ?? true);

  useEffect(() => {
    if (typeof propHalls === 'undefined') {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/halls`)
        .then(res => res.json())
        .then(data => {
          setHalls(data);
          setLoading(false);
        });
    } else {
      setHalls(propHalls);
      setLoading(!!propLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propHalls, propLoading]);

  // Color palette for initials (consistent with home page)
  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-cyan-500"
  ];

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Function Halls</h2>
        <span className="text-gray-500 text-sm">{halls.length} Function Halls</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Owner</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Location</th>
              <th className="px-6 py-4 text-center font-semibold text-lg tracking-wide">Capacity</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Contact</th>
              <th className="px-6 py-4 text-right font-semibold text-lg tracking-wide">Price</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">Loading...</td>
              </tr>
            ) : halls.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">No halls found.</td>
              </tr>
            ) : (
              halls.map((hall, idx) => (
                <tr key={hall.id} className="border-b border-gray-200 last:border-b-0 hover:bg-orange-50 transition">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <span className={`w-11 h-11 flex items-center justify-center rounded-full text-white font-black text-2xl border-2 border-white shadow ${colors[idx % colors.length]}`}
                      style={{lineHeight: '2.5rem'}}>
                      {typeof hall.name === 'string' && hall.name.length > 0 ? hall.name[0].toUpperCase() : '?'}
                    </span>
                    <Link href={`/halls/${hall.id}`} className="text-orange-700 font-semibold hover:underline">
                      {hall.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 align-middle">{hall.owner_name || "-"}</td>
                  <td className="px-6 py-4 align-middle">{hall.location}</td>
                  <td className="px-6 py-4 text-center align-middle">{hall.capacity}</td>
                  <td className="px-6 py-4 align-middle">{hall.contact_number}</td>
                  <td className="px-6 py-4 text-right align-middle font-bold text-orange-700">₹{hall.price_per_day}</td>
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-center align-middle space-x-2">
                      {onEdit && <button className="text-blue-600 font-semibold hover:underline" onClick={() => onEdit(hall)}>Edit</button>}
                      {onDelete && <button className="text-red-600 font-semibold hover:underline" onClick={() => onDelete(hall)}>Delete</button>}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
