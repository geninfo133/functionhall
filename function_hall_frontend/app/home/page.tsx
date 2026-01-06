"use client";
import { useEffect, useState, Suspense } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import HallCards from "../../components/HallCards";


function HomePageContent() {
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
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Received halls:', data.length);
        setHalls(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        setHalls([]);
        setLoading(false);
      });
  }, [searchQuery, location, date, guests]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}/api/halls?`;
      if (location) url += `location=${encodeURIComponent(location)}&`;
      if (date) url += `date=${encodeURIComponent(date)}&`;
      if (guests) url += `guests=${encodeURIComponent(guests)}&`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setHalls(data);
    } catch (err) {
      console.error('❌ Search error:', err);
      setHalls([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="p-4 sm:p-6 lg:p-8">
          {/* Hero Banner with Search */}
          <div className="relative rounded-2xl overflow-hidden mb-12" style={{ backgroundColor: '#0d316c' }}>

            <div className="px-6 sm:px-8 lg:px-12 py-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <FaSearch className="text-white text-3xl" />
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      Find Your Perfect Venue
                    </h1>
                    <p className="text-base sm:text-lg text-blue-100">
                      Discover beautiful function halls for weddings, corporate events, and celebrations
                    </p>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                        <FaMapMarkerAlt className="absolute left-3 top-8 text-gray-400 text-sm" />
                        <input
                          type="text"
                          placeholder="City or area"
                          className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Event Date</label>
                        <FaCalendarAlt className="absolute left-3 top-8 text-gray-400 text-sm" />
                        <input
                          type="date"
                          className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={date}
                          onChange={e => setDate(e.target.value)}
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
                          onChange={e => setGuests(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 items-end">
                        <button
                          onClick={handleSearch}
                          className="flex-1 bg-[#20056a] hover:bg-[#150442] text-white font-semibold py-2 text-sm rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FaSearch className="text-xs" />
                          Search
                        </button>
                        {(location || date || guests) && (
                          <button
                            type="button"
                            onClick={() => {
                              setLocation("");
                              setDate("");
                              setGuests("");
                            }}
                            className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Marquee */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-12 overflow-hidden py-4">
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
              <div className="flex items-center gap-3 px-6">
                <div className="text-2xl font-bold text-[#20056a]">{halls.length}</div>
                <p className="text-gray-600 font-medium">Premium Halls</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-[#20056a]">24/7</div>
                <p className="text-gray-600 font-medium">Customer Support</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-[#20056a]">1000+</div>
                <p className="text-gray-600 font-medium">Events Hosted</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-[#20056a]">⭐</div>
                <p className="text-gray-600 font-medium">Top Rated Service</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-[#20056a]">100%</div>
                <p className="text-gray-600 font-medium">Verified Venues</p>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-[#20056a]">{halls.length}</div>
                <p className="text-gray-600 font-medium">Premium Halls</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-[#20056a]">24/7</div>
                <p className="text-gray-600 font-medium">Customer Support</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-[#20056a]">1000+</div>
                <p className="text-gray-600 font-medium">Events Hosted</p>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Featured Halls Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Halls</h2>
                <p className="text-gray-600 mt-1">Choose from our curated collection</p>
              </div>
            </div>

            <HallCards halls={halls} loading={loading} />
          </div>
        </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

