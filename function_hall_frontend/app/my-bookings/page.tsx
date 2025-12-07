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
    <div className="min-h-screen">
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="px-6 sm:px-8 lg:px-12 py-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  My Bookings
                </h1>
                <p className="text-lg text-blue-100 mt-3">
                  View and manage your hall bookings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          
          {loading ? (
            <div className="text-center py-12">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
              <a
                href="/home"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse Halls
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <FaBuilding className="text-blue-600 text-xl mt-1" />
                      <div>
                        <h2 className="text-xl font-bold text-blue-700">{booking.hall_name}</h2>
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
                      <p className="flex items-center space-x-1 text-gray-500">
                        <FaCalendarAlt className="text-blue-600" />
                        <span>Event Date</span>
                      </p>
                      <p className="font-semibold text-blue-700">
                        {new Date(booking.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Booking ID</p>
                      <p className="font-semibold text-blue-700">#{booking.id}</p>
                    </div>
                    <div>
                      <p className="flex items-center space-x-1 text-gray-500">
                        <FaRupeeSign className="text-blue-600" />
                        <span>Amount</span>
                      </p>
                      <p className="font-bold text-blue-600 text-lg">₹{booking.total_amount}</p>
                    </div>
                  </div>

                  {booking.created_at && (
                    <p className="text-xs text-gray-400 mt-4">
                      Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
