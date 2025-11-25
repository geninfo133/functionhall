"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import Topbar from "../../components/Topbar";
import { Calendar, Clock, MapPin, Package, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    
    // First check if user is authenticated
    fetch(`${BACKEND_URL}/api/check-auth`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(authData => {
        if (!authData.authenticated) {
          // User not logged in, redirect immediately
          setError("Please log in to view your bookings.");
          setLoading(false);
          router.push("/auth/login");
          return;
        }
        
        // User is authenticated, fetch bookings
        return fetch(`${BACKEND_URL}/api/my-bookings`, {
          credentials: "include",
        });
      })
      .then(res => {
        if (!res) return null;
        if (res.status === 401) {
          // Session expired
          setError("Session expired. Please log in again.");
          setLoading(false);
          router.push("/auth/login");
          return null;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setBookings(data);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please log in.");
        setLoading(false);
        router.push("/auth/login");
      });
  }, [router]);

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return <CheckCircle size={20} className="text-green-600" />;
      case 'pending': return <AlertCircle size={20} className="text-yellow-600" />;
      case 'cancelled': return <XCircle size={20} className="text-red-600" />;
      default: return <Clock size={20} className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your function hall reservations</p>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-500"></div>
            <p className="text-gray-500 mt-4">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4 text-lg font-semibold">{error}</div>
            {error.includes("log in") && (
              <p className="text-gray-600">Redirecting to login page...</p>
            )}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No bookings found</p>
            <p className="text-gray-400 mb-6">Start by booking your first function hall!</p>
            <button
              onClick={() => router.push("/halls")}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Browse Halls
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                {/* Header with Status */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                  <h2 className="text-xl font-bold mb-1">{booking.hall_name}</h2>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className={`font-semibold ${booking.status.toLowerCase() === 'confirmed' ? 'text-white' : booking.status.toLowerCase() === 'pending' ? 'text-yellow-100' : 'text-red-100'}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Calendar size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="text-gray-800 font-semibold">{booking.event_date}</p>
                    </div>
                  </div>

                  {booking.package_name && (
                    <div className="flex items-start space-x-3">
                      <Package size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Package</p>
                        <p className="text-gray-800 font-semibold">{booking.package_name}</p>
                      </div>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Special Notes</p>
                      <p className="text-gray-700 text-sm">{booking.notes}</p>
                    </div>
                  )}

                  {/* Price */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-2xl font-bold text-orange-600">₹{booking.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
