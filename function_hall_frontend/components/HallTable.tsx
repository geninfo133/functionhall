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
    "bg-slate-600",
    "bg-slate-500",
    "bg-slate-700",
    "bg-slate-600",
    "bg-slate-500",
    "bg-slate-700",
    "bg-slate-600",
    "bg-slate-500",
    "bg-slate-700",
    "bg-slate-600"
  ];

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-200">Function Halls</h2>
        <span className="text-slate-400 text-sm">{halls.length} Function Halls</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 rounded-xl shadow border border-slate-700">
          <thead className="bg-slate-700 text-slate-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Owner</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Location</th>
              <th className="px-6 py-4 text-center font-semibold text-lg tracking-wide">Capacity</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Contact</th>
              <th className="px-6 py-4 text-right font-semibold text-lg tracking-wide">Price</th>
              {!onEdit && !onDelete && (
                <th className="px-6 py-4 text-center font-semibold text-lg tracking-wide">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td>
              </tr>
            ) : halls.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">No halls found.</td>
              </tr>
            ) : (
              halls.map((hall, idx) => (
                <tr key={hall.id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700 transition">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <span className={`w-11 h-11 flex items-center justify-center rounded-full text-white font-black text-2xl border-2 border-slate-600 shadow ${colors[idx % colors.length]}`}
                      style={{lineHeight: '2.5rem'}}>
                      {typeof hall.name === 'string' && hall.name.length > 0 ? hall.name[0].toUpperCase() : '?'}
                    </span>
                    <Link href={`/halls/${hall.id}`} className="text-slate-300 font-semibold hover:text-slate-100">
                      {hall.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 align-middle text-slate-300">{hall.owner_name || "-"}</td>
                  <td className="px-6 py-4 align-middle text-slate-300">{hall.location}</td>
                  <td className="px-6 py-4 text-center align-middle text-slate-300">{hall.capacity}</td>
                  <td className="px-6 py-4 align-middle text-slate-300">{hall.contact_number}</td>
                  <td className="px-6 py-4 text-right align-middle font-bold text-slate-300">₹{hall.price_per_day}</td>
                  {!onEdit && !onDelete && (
                    <td className="px-6 py-4 text-center align-middle">
                      <Link
                        href={`/booking?hallId=${hall.id}`}
                        className="bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition inline-block"
                      >
                        Book Now
                      </Link>
                    </td>
                  )}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-center align-middle space-x-2">
                      {onEdit && <button className="text-slate-300 font-semibold hover:text-slate-100" onClick={() => onEdit(hall)}>Edit</button>}
                      {onDelete && <button className="text-slate-300 font-semibold hover:text-slate-100" onClick={() => onDelete(hall)}>Delete</button>}
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
