"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import { FaTachometerAlt, FaBuilding, FaCalendarCheck, FaEnvelope, FaUser, FaSignOutAlt, FaPhone, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

interface Enquiry {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  hall_id: number;
  hall_name?: string;
  message: string;
  status: string;
  created_at: string;
}

export default function VendorEnquiriesPage() {
  const router = useRouter();
  const [vendorData, setVendorData] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
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

      // Fetch vendor's enquiries
      fetchVendorEnquiries(data.admin.id);
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/vendor/login");
    }
  };

  const fetchVendorEnquiries = async (vendorId: number) => {
    try {
      // First get vendor's halls
      const hallsRes = await fetch(`${BACKEND_URL}/api/vendor/${vendorId}/halls`);
      if (!hallsRes.ok) {
        setLoading(false);
        return;
      }
      
      const halls = await hallsRes.json();
      const hallIds = halls.map((h: any) => h.id);

      // Then get all enquiries
      const enquiriesRes = await fetch(`${BACKEND_URL}/api/inquiries`);
      if (!enquiriesRes.ok) {
        setLoading(false);
        return;
      }

      const allEnquiries = await enquiriesRes.json();
      
      // Filter enquiries for vendor's halls and add hall names
      const vendorEnquiries = allEnquiries
        .filter((e: Enquiry) => hallIds.includes(e.hall_id))
        .map((e: Enquiry) => {
          const hall = halls.find((h: any) => h.id === e.hall_id);
          return { ...e, hall_name: hall?.name || 'Unknown Hall' };
        });

      setEnquiries(vendorEnquiries);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    window.location.href = "/vendor/login";
  };

  const handleMarkReplied = async (enquiryId: number) => {
    try {
      const token = localStorage.getItem("vendorToken");
      const res = await fetch(`${BACKEND_URL}/api/inquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Responded' })
      });

      if (res.ok) {
        setEnquiries(enquiries.map(e => 
          e.id === enquiryId ? { ...e, status: 'Responded' } : e
        ));
      }
    } catch (err) {
      console.error("Failed to update enquiry:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    if (filter === "all") return true;
    return enquiry.status?.toLowerCase() === filter;
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
              <Link href="/vendor/bookings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 font-semibold transition">
                <FaCalendarCheck />
                <span>Bookings</span>
              </Link>
            </li>
            <li>
              <Link href="/vendor/enquiries" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold transition">
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
              <h1 className="text-2xl font-bold text-blue-600">Customer Enquiries</h1>
              <p className="text-sm text-gray-600">View and respond to customer enquiries for your halls</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">
              <div className="text-3xl font-bold text-blue-600">{enquiries.length}</div>
              <div className="text-gray-600 mt-1">Total Enquiries</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-600">
              <div className="text-3xl font-bold text-yellow-600">
                {enquiries.filter(e => e.status?.toLowerCase() === 'pending').length}
              </div>
              <div className="text-gray-600 mt-1">Pending</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
              <div className="text-3xl font-bold text-green-600">
                {enquiries.filter(e => e.status?.toLowerCase() === 'responded').length}
              </div>
              <div className="text-gray-600 mt-1">Responded</div>
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
                All ({enquiries.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({enquiries.filter(e => e.status?.toLowerCase() === 'pending').length})
              </button>
              <button
                onClick={() => setFilter("responded")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "responded"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Responded ({enquiries.filter(e => e.status?.toLowerCase() === 'responded').length})
              </button>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="space-y-4">
            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <FaEnvelope className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No enquiries found</h3>
                <p className="text-gray-500">
                  {filter === "all" 
                    ? "You don't have any enquiries yet." 
                    : `No ${filter} enquiries at the moment.`}
                </p>
              </div>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaUser className="text-blue-600" />
                            {enquiry.customer_name}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaEnvelope className="text-gray-400" />
                              {enquiry.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaPhone className="text-gray-400" />
                              {enquiry.phone}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(enquiry.status)}`}>
                          {enquiry.status || 'Pending'}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FaBuilding className="text-blue-600" />
                          <span className="font-semibold text-gray-700">{enquiry.hall_name}</span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Message:</span> {enquiry.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {enquiry.status?.toLowerCase() === 'pending' && (
                          <button
                            onClick={() => handleMarkReplied(enquiry.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                          >
                            Mark as Replied
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
