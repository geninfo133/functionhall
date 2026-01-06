"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import RoleSidebar from "../../components/RoleSidebar";
import { FaCalendarCheck, FaBuilding, FaCalendarAlt, FaRupeeSign, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

export default function MyBookingsPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if customer is logged in
    const customerInfo = localStorage.getItem("customerInfo");
    if (!customerInfo) {
      router.push("/customer/login");
      return;
    }
    
    const parsedCustomer = JSON.parse(customerInfo);
    setCustomer(parsedCustomer);

    // Fetch customer bookings
    fetch(`${BACKEND_URL}/api/customer/${parsedCustomer.id}/bookings`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
        {/* Hero Banner */}
        <div style={{ backgroundColor: '#0d316cff' }} className="rounded-2xl overflow-hidden mb-8 shadow-lg">
          <div className="px-6 sm:px-8 lg:px-12 py-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaCalendarCheck className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  My Bookings
                </h1>
                <p className="text-lg text-white/80 mt-1">
                  View and manage your hall bookings
                </p>
              </div>
            </div>
          </div>
        </div>
          
          {loading ? (
            <div className="text-center py-12">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
              <a
                href="/home"
                className="inline-block bg-[#20056a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#150442] transition"
              >
                Browse Halls
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => {
                const cardColors = [
                  { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'text-blue-600' },
                  { bg: 'bg-gradient-to-br from-purple-50 to-purple-100', border: 'border-purple-200', icon: 'text-purple-600' },
                  { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', border: 'border-emerald-200', icon: 'text-emerald-600' },
                  { bg: 'bg-gradient-to-br from-rose-50 to-rose-100', border: 'border-rose-200', icon: 'text-rose-600' },
                  { bg: 'bg-gradient-to-br from-amber-50 to-amber-100', border: 'border-amber-200', icon: 'text-amber-600' },
                ];
                const colorScheme = cardColors[index % cardColors.length];
                
                return (
                <div key={booking.id} className={`${colorScheme.bg} rounded-xl shadow border-2 ${colorScheme.border} p-6 hover:shadow-lg transition`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <FaBuilding className={`${colorScheme.icon} text-xl mt-1`} />
                      <div>
                        <h2 className={`text-xl font-bold ${colorScheme.icon}`}>{booking.hall_name}</h2>
                        <p className="text-gray-600">{booking.hall_location}</p>
                      </div>
                    </div>
                    <span className={`flex items-center space-x-1 px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status === 'Confirmed' && <FaCheckCircle />}
                      {booking.status === 'Pending' && <FaClock />}
                      {booking.status === 'Cancelled' && <FaTimesCircle />}
                      <span>{booking.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="flex items-center space-x-1 text-gray-600">
                        <FaCalendarAlt className={colorScheme.icon} />
                        <span>Event Date</span>
                      </p>
                      <p className={`font-semibold ${colorScheme.icon}`}>
                        {new Date(booking.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Booking ID</p>
                      <p className={`font-semibold ${colorScheme.icon}`}>#{booking.id}</p>
                    </div>
                    <div>
                      <p className="flex items-center space-x-1 text-gray-600">
                        <FaRupeeSign className={colorScheme.icon} />
                        <span>Amount</span>
                      </p>
                      <p className={`font-bold ${colorScheme.icon} text-lg`}>₹{booking.total_amount}</p>
                    </div>
                  </div>

                  {booking.created_at && (
                    <p className="text-xs text-gray-500 mt-4">
                      Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
