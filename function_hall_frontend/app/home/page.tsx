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

          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg" style={{ background: '#0d316cff' }}>

            <div className="px-6 sm:px-8 lg:px-12 py-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#fff', fontFamily: 'Inter, Arial, sans-serif' }}>
                    Find Your Perfect Venue
                </h1>
                <p className="text-base mt-2 max-w-2xl mx-auto" style={{ color: '#18c9e8ff', fontFamily: 'Inter, Arial, sans-serif' }}>
                  Discover beautiful function halls for weddings, corporate events, and celebrations
                </p>
                </div>

                <div className="mt-3">
                  <div className="bg-white rounded-xl shadow-lg p-3 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="relative">
                        <label className="block text-base font-bold" style={{ color: '#20056a' }}>Location</label>
                        <FaMapMarkerAlt className="absolute left-2.5 top-7 text-gray-400 text-xs" />
                        <input
                          type="text"
                          placeholder="City or area"
                          className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-base font-bold" style={{ color: '#20056a' }}>Event Date</label>
                        <FaCalendarAlt className="absolute left-2.5 top-7 text-gray-400 text-xs" />
                        <input
                          type="date"
                          className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={date}
                          onChange={e => setDate(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-base font-bold" style={{ color: '#20056a' }}>Guests</label>
                        <FaUsers className="absolute left-2.5 top-7 text-gray-400 text-xs" />
                        <input
                          type="number"
                          placeholder="How many?"
                          className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                          value={guests}
                          onChange={e => setGuests(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 items-end">
                        <button
                          onClick={handleSearch}
                          className="flex-1 sample-btn text-xs font-semibold py-1.5 rounded-lg transition flex items-center justify-center gap-1.5"
                          style={{ background: '#20056a', color: '#fff' }}
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
                            className="sample-btn text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                            style={{ background: '#20056a', color: '#fff' }}
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
                <div className="text-2xl font-bold text-blue-600">{halls.length}</div>
                <p className="text-gray-600 font-medium">Premium Halls</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <p className="text-gray-600 font-medium">Customer Support</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <p className="text-gray-600 font-medium">Events Hosted</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-blue-600">⭐</div>
                <p className="text-gray-600 font-medium">Top Rated Service</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <p className="text-gray-600 font-medium">Verified Venues</p>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{halls.length}</div>
                <p className="text-gray-600 font-medium">Premium Halls</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <p className="text-gray-600 font-medium">Customer Support</p>
              </div>
              <div className="flex items-center gap-3 px-6 border-l border-gray-200">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
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
                <h2 className="text-3xl font-bold" style={{ color: '#20056a' }}>Featured Halls</h2>
                <p className="mt-1" style={{ color: '#057080' }}>Choose from our curated collection</p>
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

// Custom button color classes for use in this page
import React from "react";

export const style = (
  <style jsx global>{`
    .btn-primary { background: #010509; color: #fff; }
    .btn-secondary { background: #20056a; color: #fff; }
    .btn-success { background: #28a745; color: #fff; }
    .btn-danger { background: #eb4007; color: #fff; }
    .btn-warning { background: #ffc107; color: #333; }
    .btn-info { background: #057080; color: #fff; }
    .btn-light { background: #f8f9fa; color: #333; border: 1px solid #ccc; }
    .btn-dark { background: #343a40; color: #fff; }
    .sample-btn:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.12); opacity: 0.92; }
  `}</style>
);

