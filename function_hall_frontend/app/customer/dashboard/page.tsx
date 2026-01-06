"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBuilding, FaCalendarAlt, FaEnvelope, FaUser, FaCalendarPlus, FaSearch } from "react-icons/fa";

export default function CustomerDashboard() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if customer is logged in
    const token = localStorage.getItem('customerToken');
    const customerInfo = localStorage.getItem('customerInfo');
    
    if (!token || !customerInfo) {
      router.push('/customer/login');
      return;
    }

    try {
      const info = JSON.parse(customerInfo);
      setCustomerName(info.name || "Customer");
      setCustomerEmail(info.email || "");
    } catch (err) {
      router.push('/customer/login');
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-[#0d316cff] rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome, {customerName}!
              </h1>
              <p className="text-white/80">{customerEmail}</p>
            </div>
          </div>
          <p className="text-white/90">
            Manage your bookings, browse halls, and send enquiries all in one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/halls"
            className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 border border-blue-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-300 rounded-lg flex items-center justify-center">
                <FaSearch className="text-blue-700 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Browse Halls</h3>
                <p className="text-sm text-blue-600">Find the perfect venue</p>
              </div>
            </div>
          </Link>

          <Link
            href="/booking"
            className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 border border-emerald-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-300 rounded-lg flex items-center justify-center">
                <FaCalendarPlus className="text-emerald-700 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-800">Book a Hall</h3>
                <p className="text-sm text-emerald-600">Make a new booking</p>
              </div>
            </div>
          </Link>

          <Link
            href="/customer/enquiry"
            className="bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 border border-violet-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-300 rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-violet-700 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-violet-800">Send Enquiry</h3>
                <p className="text-sm text-violet-600">Ask us anything</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Bookings */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-orange-800 flex items-center gap-2">
                <FaCalendarAlt className="text-orange-600" />
                My Bookings
              </h2>
              <Link
                href="/my-bookings"
                className="text-orange-600 hover:underline text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <p className="text-orange-700 mb-4">
              View and manage all your hall bookings in one place.
            </p>
            <Link
              href="/my-bookings"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Go to Bookings
            </Link>
          </div>

          {/* Profile Settings */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-md p-6 border border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-pink-800 flex items-center gap-2">
                <FaUser className="text-pink-600" />
                Profile
              </h2>
              <Link
                href="/profile"
                className="text-pink-600 hover:underline text-sm font-medium"
              >
                Edit Profile
              </Link>
            </div>
            <p className="text-pink-700 mb-4">
              Update your personal information and preferences.
            </p>
            <Link
              href="/profile"
              className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
