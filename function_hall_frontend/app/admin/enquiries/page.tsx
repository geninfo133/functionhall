"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaUser, FaPhone, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSort, FaTimes, FaCheck } from "react-icons/fa";
import { BACKEND_URL } from "../../../lib/config";

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [filterHall, setFilterHall] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [halls, setHalls] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/admin/check-auth`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      fetchEnquiries();
      fetchHalls();
    };

    checkAuth();
  }, [router]);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries`);
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Enquiries data:', data);
        
        setEnquiries(data);
        setFilteredEnquiries(data);
        
        // Extract unique locations from enquiries
        const uniqueLocations = Array.from(new Set(data.map((e: any) => e.location).filter(Boolean)));
        setLocations(uniqueLocations as string[]);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHalls = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/halls`);
      if (response.ok) {
        const data = await response.json();
        setHalls(data);
      }
    } catch (error) {
      console.error('Error fetching halls:', error);
    }
  };

  useEffect(() => {
    let filtered = [...enquiries];

    // Filter by hall
    if (filterHall) {
      filtered = filtered.filter(e => e.hall_id === parseInt(filterHall));
    }

    // Filter by location
    if (filterLocation) {
      filtered = filtered.filter(e => e.location === filterLocation);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name":
          return a.customer_name.localeCompare(b.customer_name);
        case "hall":
          return (a.hall_name || "").localeCompare(b.hall_name || "");
        case "location":
          return (a.location || "").localeCompare(b.location || "");
        default:
          return 0;
      }
    });

    setFilteredEnquiries(filtered);
  }, [sortBy, filterHall, filterLocation, enquiries]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Responded":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-blue-600 text-3xl" />
              <h1 className="text-3xl font-bold text-blue-700">Customer Enquiries</h1>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-bold text-blue-600">{filteredEnquiries.length}</span> enquiries
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort By */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaSort className="text-blue-600" />
                  <span>Sort By</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="date">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="name">Customer Name</option>
                  <option value="hall">Hall Name</option>
                  <option value="location">Location</option>
                </select>
              </div>

              {/* Filter by Hall */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaBuilding className="text-blue-600" />
                  <span>Filter by Hall</span>
                </label>
                <select
                  value={filterHall}
                  onChange={(e) => setFilterHall(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All Halls</option>
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Location */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span>Filter by Location</span>
                </label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(filterHall || filterLocation) && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setFilterHall("");
                    setFilterLocation("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Enquiries List */}
          {filteredEnquiries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <FaEnvelope className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-600">No enquiries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaUser className="text-blue-600" />
                        <h3 className="text-lg font-bold text-blue-700">{enquiry.customer_name}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FaPhone className="text-blue-600" />
                          <span>{enquiry.customer_phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-blue-600" />
                          <span>
                            {enquiry.created_at ? (() => {
                              const date = new Date(enquiry.created_at);
                              return !isNaN(date.getTime()) ? date.toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : enquiry.created_at;
                            })() : 'N/A'}
                          </span>
                        </div>
                        {enquiry.hall_name && (
                          <div className="flex items-center space-x-2">
                            <FaBuilding className="text-blue-600" />
                            <span>{enquiry.hall_name}</span>
                          </div>
                        )}
                        {enquiry.location && (
                          <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt className="text-blue-600" />
                            <span>{enquiry.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(enquiry.status || 'Pending')}`}>
                        {enquiry.status || 'Pending'}
                      </span>
                      {enquiry.status === 'Pending' && (
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`${BACKEND_URL}/api/inquiries/${enquiry.id}/status`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'Responded' })
                              });
                              if (response.ok) {
                                const updatedEnquiries = enquiries.map(e => 
                                  e.id === enquiry.id ? { ...e, status: 'Responded' } : e
                                );
                                setEnquiries(updatedEnquiries);
                              }
                            } catch (error) {
                              console.error('Error updating status:', error);
                            }
                          }}
                          className="flex items-center space-x-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition"
                        >
                          <FaCheck />
                          <span>Mark Replied</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div 
                    className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => setSelectedEnquiry(selectedEnquiry === enquiry.id ? null : enquiry.id)}
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-1">Message:</p>
                    <p className="text-gray-600 text-sm">
                      {selectedEnquiry === enquiry.id 
                        ? enquiry.message 
                        : enquiry.message.length > 100 
                          ? `${enquiry.message.substring(0, 100)}...` 
                          : enquiry.message
                      }
                    </p>
                    {enquiry.message.length > 100 && (
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold mt-1">
                        {selectedEnquiry === enquiry.id ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {enquiry.event_date && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-semibold">Event Date:</span>{" "}
                      {(() => {
                        const date = new Date(enquiry.event_date);
                        return !isNaN(date.getTime()) ? date.toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : enquiry.event_date;
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
    </div>
  );
}
