"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import { FaTachometerAlt, FaBuilding, FaCalendarCheck, FaEnvelope, FaUser, FaSignOutAlt, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign, FaClock } from "react-icons/fa";
import Link from "next/link";

interface Booking {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  hall_id: number;
  hall_name: string;
  event_date: string;
  event_type: string;
  number_of_guests: number;
  package_id?: number;
  package_name?: string;
  total_price: number;
  status: string;
  special_requests?: string;
  created_at: string;
}

export default function VendorBookingsPage() {
  const router = useRouter();
  const [vendorData, setVendorData] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("vendorToken");
    const storedVendor = localStorage.getItem("vendorData");

    if (!token || !storedVendor) {
      router.push("/vendor/login");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/check-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        localStorage.removeItem("vendorToken");
        localStorage.removeItem("vendorData");
        router.push("/vendor/login");
        return;
      }

      const data = await res.json();
      setVendorData(data.admin);

      if (!data.admin.is_approved) {
        setLoading(false);
        return;
      }

      // Fetch vendor's bookings
      fetchVendorBookings(data.admin.id);
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/vendor/login");
    }
  };

  const fetchVendorBookings = async (vendorId: number) => {
    try {
      // First get vendor's halls
      const hallsRes = await fetch(`${BACKEND_URL}/api/vendor/${vendorId}/halls`);
      if (!hallsRes.ok) {
        setLoading(false);
        return;
      }
      
      const halls = await hallsRes.json();
      const hallIds = halls.map((h: any) => h.id);

      // Then get all bookings
      const bookingsRes = await fetch(`${BACKEND_URL}/api/bookings`);
      if (!bookingsRes.ok) {
        setLoading(false);
        return;
      }

      const allBookings = await bookingsRes.json();
      
      // Filter bookings for vendor's halls and enrich with hall names
      const vendorBookings = allBookings
        .filter((b: any) => hallIds.includes(b.hall_id))
        .map((b: any) => {
          const hall = halls.find((h: any) => h.id === b.hall_id);
          return {
            ...b,
            hall_name: hall?.name || 'Unknown Hall',
            customer_name: b.customer_name || 'Unknown Customer',
            customer_phone: b.customer_phone || 'N/A',
            customer_email: b.customer_email || 'N/A'
          };
        });

      setBookings(vendorBookings);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    window.location.href = "/vendor/login";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  if (vendorData && !vendorData.is_approved) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your vendor account is awaiting admin approval.
          </p>
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 min-h-screen shadow-lg flex flex-col p-6 border-r border-slate-700">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Vendor Panel</h2>
          <p className="text-sm text-slate-400 mt-1">Manage your business</p>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link href="/vendor/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 font-semibold transition">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/vendor/halls" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 font-semibold transition">
                <FaBuilding />
                <span>My Halls</span>
              </Link>
            </li>
            <li>
              <Link href="/vendor/bookings" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold transition">
                <FaCalendarCheck />
                <span>Bookings</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/enquiries" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 font-semibold transition">
                <FaEnvelope />
                <span>Enquiries</span>
              </Link>
            </li>
            <li>
              <Link href="/vendor/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 font-semibold transition">
                <FaUser />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Bookings Management</h1>
              <p className="text-sm text-gray-600">View and manage all bookings for your halls</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">
              <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
              <div className="text-gray-600 mt-1">Total Bookings</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-600">
              <div className="text-3xl font-bold text-yellow-600">
                {bookings.filter(b => b.status?.toLowerCase() === 'pending').length}
              </div>
              <div className="text-gray-600 mt-1">Pending</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
              </div>
              <div className="text-gray-600 mt-1">Confirmed</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-600">
              <div className="text-3xl font-bold text-purple-600">
                ₹{bookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-600 mt-1">Total Revenue</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({bookings.filter(b => b.status?.toLowerCase() === 'pending').length})
              </button>
              <button
                onClick={() => setFilter("confirmed")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "confirmed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Confirmed ({bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completed ({bookings.filter(b => b.status?.toLowerCase() === 'completed').length})
              </button>
              <button
                onClick={() => setFilter("cancelled")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancelled ({bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-xl shadow">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center">
                <FaCalendarCheck className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
                <p className="text-gray-500">
                  {filter === "all" 
                    ? "You don't have any bookings yet." 
                    : `No ${filter} bookings at the moment.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Hall
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Event Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Event Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">#{booking.id}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <FaPhone size={10} /> {booking.customer_phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <FaBuilding className="text-blue-600" />
                            {booking.hall_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <FaCalendarAlt className="text-purple-600" />
                            {new Date(booking.event_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.event_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-1">
                            <FaUser className="text-gray-400" />
                            {booking.number_of_guests}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                            <FaRupeeSign size={12} />
                            {booking.total_price?.toLocaleString()}
                          </div>
                          {booking.package_name && (
                            <div className="text-xs text-gray-500">{booking.package_name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
