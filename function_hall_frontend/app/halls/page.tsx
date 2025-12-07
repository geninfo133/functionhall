"use client";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch } from "react-icons/fa";
import { BACKEND_URL } from "../../lib/config";
import HallCards from "../../components/HallCards";

export default function BrowseHallsPage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async (filters?: { location?: string; date?: string; guests?: string }) => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}/api/halls?`;
      if (filters?.location) url += `location=${encodeURIComponent(filters.location)}&`;
      if (filters?.date) url += `date=${encodeURIComponent(filters.date)}&`;
      if (filters?.guests) url += `guests=${encodeURIComponent(filters.guests)}&`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setHalls(data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setHalls([]);
    }
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchHalls({ location, date, guests });
  };

  const handleClearFilters = () => {
    setLocation("");
    setDate("");
    setGuests("");
    fetchHalls();
  };

  return (
    <div className="min-h-screen">
      <main className="p-4 sm:p-6 lg:p-8 pt-8">
        {/* Hero Banner with Search */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="px-6 py-2.5">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-2">
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Browse Function Halls
                </h1>
              </div>

              <div>
                <div className="bg-white rounded-xl shadow-lg p-3 max-w-5xl mx-auto">
                  <form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <FaMapMarkerAlt className="absolute left-2.5 top-7 text-gray-400 text-xs" />
                        <input
                          type="text"
                          placeholder="City or area"
                          className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Event Date</label>
                        <FaCalendarAlt className="absolute left-2.5 top-7 text-gray-400 text-xs" />
                        <input
                          type="date"
                          className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                        <FaUsers className="absolute left-2.5 top-7 text-gray-400 text-xs" />
                        <input
                          type="number"
                          placeholder="How many?"
                          className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 items-end">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                        >
                          <FaSearch className="text-xs" />
                          Search
                        </button>
                        {(location || date || guests) && (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-2.5 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-blue-600">{halls.length}</span> halls found
            </p>
          </div>
        )}

        {/* Hall Cards */}
        <HallCards halls={halls} loading={loading} />
      </main>
    </div>
  );
}
