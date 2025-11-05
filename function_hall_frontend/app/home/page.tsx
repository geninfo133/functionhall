"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import Link from "next/link";
import RoleSidebar from "../../components/RoleSidebar";
import Topbar from "../../components/Topbar";

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
    fetch(url)
      .then(res => res.json())
      .then(data => {
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
        <Topbar />
        <main className="p-8">
          {/* Hero Section */}
          <section className="bg-blue-100 rounded-2xl p-8 mb-8 flex flex-col items-center text-center shadow">
            <h1 className="text-5xl font-extrabold text-blue-900 mb-4">Find the Perfect Function Hall</h1>
            <p className="text-lg text-blue-700 mb-6">Book top-rated halls for your events, weddings, and celebrations!</p>
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
                className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </section>

          {/* Halls Table */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Function Halls</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
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
                    {halls.map((hall, idx) => (
                      <tr key={hall.id} className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition">
                        <td className="px-6 py-4 flex items-center space-x-2">
                          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-white font-bold text-base ${["bg-blue-500","bg-green-500","bg-purple-500","bg-pink-500","bg-yellow-500","bg-teal-500"][idx % 6]}`}>{hall.name[0]}</span>
                          <Link href={`/halls/${hall.id}`} className="text-blue-700 font-semibold hover:underline">
                            {hall.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 align-middle">{hall.owner_name || "-"}</td>
                        <td className="px-6 py-4 align-middle">{hall.location}</td>
                        <td className="px-6 py-4 text-center align-middle">{hall.capacity}</td>
                        <td className="px-6 py-4 align-middle">{hall.contact_number}</td>
                        <td className="px-6 py-4 text-right align-middle font-bold text-blue-700">₹{hall.price_per_day}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

