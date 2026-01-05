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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#20056a] rounded-full flex items-center justify-center">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {customerName}!
              </h1>
              <p className="text-gray-600">{customerEmail}</p>
            </div>
          </div>
          <p className="text-gray-700">
            Manage your bookings, browse halls, and send enquiries all in one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/halls"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaSearch className="text-[#20056a] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Browse Halls</h3>
                <p className="text-sm text-gray-600">Find the perfect venue</p>
              </div>
            </div>
          </Link>

          <Link
            href="/booking"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCalendarPlus className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Book a Hall</h3>
                <p className="text-sm text-gray-600">Make a new booking</p>
              </div>
            </div>
          </Link>

          <Link
            href="/customer/enquiry"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Send Enquiry</h3>
                <p className="text-sm text-gray-600">Ask us anything</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaCalendarAlt className="text-[#20056a]" />
                My Bookings
              </h2>
              <Link
                href="/my-bookings"
                className="text-[#20056a] hover:underline text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <p className="text-gray-600 mb-4">
              View and manage all your hall bookings in one place.
            </p>
            <Link
              href="/my-bookings"
              className="inline-block bg-[#20056a] text-white px-6 py-2 rounded-lg hover:bg-[#150442] transition"
            >
              Go to Bookings
            </Link>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaUser className="text-[#20056a]" />
                Profile
              </h2>
              <Link
                href="/profile"
                className="text-[#20056a] hover:underline text-sm font-medium"
              >
                Edit Profile
              </Link>
            </div>
            <p className="text-gray-600 mb-4">
              Update your personal information and preferences.
            </p>
            <Link
              href="/profile"
              className="inline-block bg-[#20056a] text-white px-6 py-2 rounded-lg hover:bg-[#150442] transition"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
