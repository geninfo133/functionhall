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
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
        {/* Hero Banner with Search */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg" style={{ backgroundColor: '#0d316cff' }}>
          <div className="px-6 sm:px-8 lg:px-12 py-8">
            <div className="flex items-center gap-3 mb-6">
              <FaSearch className="text-white text-3xl" />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Browse Function Halls
                </h1>
                <p className="text-base sm:text-lg text-blue-100 font-light">
                  Find the perfect venue for your special event
                </p>
              </div>
            </div>

              <div>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4">
                  <form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                        <FaMapMarkerAlt className="absolute left-3 top-8 text-gray-400 text-sm" />
                        <input
                          type="text"
                          placeholder="City or area"
                          className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Event Date</label>
                        <FaCalendarAlt className="absolute left-3 top-8 text-gray-400 text-sm" />
                        <input
                          type="date"
                          className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Guests</label>
                        <FaUsers className="absolute left-3 top-8 text-gray-400 text-sm" />
                        <input
                          type="number"
                          placeholder="How many?"
                          className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 items-end">
                        <button
                          type="submit"
                          className="flex-1 bg-[#20056a] hover:bg-[#150442] text-white font-semibold py-2 text-sm rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FaSearch className="text-xs" />
                          Search
                        </button>
                        {(location || date || guests) && (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
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

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-[#20056a]">{halls.length}</span> halls found
            </p>
          </div>
        )}

        {/* Hall Cards */}
        <HallCards halls={halls} loading={loading} />
        </div>
      </main>
    </div>
  );
}
