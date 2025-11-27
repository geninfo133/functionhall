"use client";
import { useEffect, useState } from "react";

// Avatar color palette
const AVATAR_COLORS = [
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
import { useSearchParams } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import Link from "next/link";
import RoleSidebar from "../../components/RoleSidebar";
import HallTable from "../../components/HallTable";

export default function HomePage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    let url = `${BACKEND_URL}/api/halls?`;
    if (searchQuery) {
      url += `name=${encodeURIComponent(searchQuery)}&`;
    } else {
      if (location) url += `location=${encodeURIComponent(location)}&`;
    }
    if (date) url += `date=${encodeURIComponent(date)}&`;
    if (guests) url += `guests=${encodeURIComponent(guests)}&`;
    
    console.log('🔍 Fetching URL:', url);
    console.log('Guests value:', guests, 'Type:', typeof guests);
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Received halls:', data.length);
        setHalls(data);
        setLoading(false);
      });
  }, [searchQuery, location, date, guests]);

  const handleSearch = async () => {
    setLoading(true);
    let url = `${BACKEND_URL}/api/halls?`;
    if (location) url += `location=${encodeURIComponent(location)}&`;
    if (date) url += `date=${encodeURIComponent(date)}&`;
    if (guests) url += `guests=${encodeURIComponent(guests)}&`;
    const res = await fetch(url);
    const data = await res.json();
    setHalls(data);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RoleSidebar role="customer" />
      <div className="flex-1 flex flex-col">
        <main className="p-8">
          {/* Hero Section */}
          <section className="bg-orange-50 rounded-2xl p-8 mb-8 flex flex-col items-center text-center shadow">
            <h1 className="text-5xl font-extrabold text-orange-500 mb-4">Find the Perfect Function Hall</h1>
            <p className="text-lg text-orange-500 mb-6">Book top-rated halls for your events, weddings, and celebrations!</p>
            {/* Search Bar */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <input
                type="text"
                placeholder="Location"
                className="px-4 py-2 rounded-lg border w-40"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
              <input
                type="date"
                className="px-4 py-2 rounded-lg border w-40"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
              <input
                type="number"
                placeholder="Guests"
                className="px-4 py-2 rounded-lg border w-32"
                value={guests}
                onChange={e => setGuests(e.target.value)}
              />
              <button
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-700 transition"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </section>

          {/* Halls Table */}
          <section>
           
            <HallTable halls={halls} loading={loading} />
          </section>
        </main>
      </div>
    </div>
  );
}

