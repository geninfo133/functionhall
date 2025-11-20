"use client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../lib/config";
import HallCard from "../../components/HallCard";
import { Hall } from "../../types/hall";

export default function BrowseHallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    setLoading(true);
    let url = `${BACKEND_URL}/api/halls?`;
    if (location) url += `location=${encodeURIComponent(location)}&`;
    if (guests) url += `guests=${encodeURIComponent(guests)}&`;
    if (sort) url += `sort=${encodeURIComponent(sort)}&`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setHalls(data);
        setLoading(false);
      });
  }, [location, guests, sort]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">Browse Function Halls</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Location"
          className="px-4 py-2 rounded-lg border w-40"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Guests"
          className="px-4 py-2 rounded-lg border w-32"
          value={guests}
          onChange={e => setGuests(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg border"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="capacity_asc">Capacity: Low to High</option>
          <option value="capacity_desc">Capacity: High to Low</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading halls...</div>
      ) : halls.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No halls found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {halls.map(hall => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      )}
    </div>
  );
}
