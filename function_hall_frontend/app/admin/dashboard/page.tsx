"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUsers, FaBuilding, FaClipboardList, FaRupeeSign, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { BACKEND_URL } from "../../../lib/config";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hallRequests, setHallRequests] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          console.log('❌ No admin token found');
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/admin/check-auth`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          console.log('❌ Auth check failed, clearing token');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        if (data.authenticated && data.admin) {
          console.log('✅ Admin authenticated:', data.admin.email, 'Role:', data.admin.role);
          
          // Check if user is actually a vendor
          if (data.admin.role === 'vendor') {
            console.log('⚠️ Vendor trying to access admin dashboard, redirecting...');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            localStorage.setItem('vendorToken', token);
            localStorage.setItem('vendorData', JSON.stringify(data.admin));
            window.location.href = '/vendor/dashboard';
            return;
          }
          
          // Check if user is super_admin
          if (data.admin.role !== 'super_admin') {
            console.log('❌ Not a super admin');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            router.push('/admin/login');
            return;
          }
          
          setAdmin(data.admin);
        } else {
          console.log('❌ Not authenticated');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('💥 Auth check error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const [stats, setStats] = useState({
    total_halls: 0,
    total_bookings: 0,
    total_customers: 0,
    total_revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchHallRequests = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/hall-requests?status=pending`);
        if (response.ok) {
          const data = await response.json();
          setHallRequests(data);
        }
      } catch (error) {
        console.error('Error fetching hall requests:', error);
      }
    };

    if (admin) {
      fetchStats();
      fetchHallRequests();
    }
  }, [admin]);

  const approveRequest = async (requestId: number, actionType: string) => {
    if (!confirm(`Approve this ${actionType} request?`)) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Not authenticated. Please login again.");
        window.location.href = "/admin/login";
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/admin/hall-requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Request approved successfully!");
        // Refresh hall requests
        const response = await fetch(`${BACKEND_URL}/api/admin/hall-requests?status=pending`);
        if (response.ok) {
          const data = await response.json();
          setHallRequests(data);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      alert("Error approving request");
    }
  };

  const rejectRequest = async (requestId: number, actionType: string) => {
    const reason = prompt(`Reject this ${actionType} request?\nEnter rejection reason (optional):`);
    if (reason === null) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Not authenticated. Please login again.");
        window.location.href = "/admin/login";
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/admin/hall-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reason || "No reason provided" }),
      });

      if (res.ok) {
        alert("Request rejected successfully!");
        // Refresh hall requests
        const response = await fetch(`${BACKEND_URL}/api/admin/hall-requests?status=pending`);
        if (response.ok) {
          const data = await response.json();
          setHallRequests(data);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reject request");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const statsDisplay = [
    { label: "Total Halls", value: stats.total_halls, icon: <FaBuilding className="text-[#20056a] text-3xl" /> },
    { label: "Total Bookings", value: stats.total_bookings, icon: <FaClipboardList className="text-[#20056a] text-3xl" /> },
    { label: "Total Customers", value: stats.total_customers, icon: <FaUsers className="text-blue-400 text-3xl" /> },
    { label: "Revenue", value: `₹${stats.total_revenue.toLocaleString('en-IN')}`, icon: <FaRupeeSign className="text-[#20056a] text-3xl" /> },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="flex items-center justify-between bg-[#20056a] text-white rounded-2xl shadow-lg px-8 py-6 mb-10 animate-fade-in">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 drop-shadow">Welcome, {admin.name}!</h1>
              <p className="text-lg font-medium opacity-90">Manage your function halls, bookings, and more with ease.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="/G.png" 
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">{admin.name}</span>
            </div>
          </div>
          {/* Stat Cards with Glassmorphism and Hover Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-5xl">
            {statsDisplay.map((stat, idx) => (
              <div key={stat.label} className="backdrop-blur-lg bg-white/60 rounded-xl shadow-md border border-gray-200 flex items-center gap-3 p-4 transition-transform duration-200 hover:scale-105 hover:bg-blue-50">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold text-[#20056a]">{stat.value}</div>
                  <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Quick Links with Glassmorphism and Icon Animation */}
          <nav className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            <Link href="/admin/halls" className="block backdrop-blur-lg bg-white/60 rounded-xl shadow-md p-5 hover:bg-blue-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-lg font-semibold text-[#20056a] flex items-center gap-2"><FaBuilding className="text-[#20056a] animate-bounce" /> Manage Halls</span>
              <p className="text-sm text-gray-600 mt-1">Add, edit, or delete function halls.</p>
            </Link>
            <Link href="/admin/vendors" className="block backdrop-blur-lg bg-white/60 rounded-xl shadow-md p-5 hover:bg-green-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-lg font-semibold text-green-700 flex items-center gap-2"><FaUserCircle className="text-green-600 animate-bounce" /> Manage Vendors</span>
              <p className="text-sm text-gray-600 mt-1">Approve and manage vendor accounts.</p>
            </Link>
            <Link href="/admin/packages" className="block backdrop-blur-lg bg-white/60 rounded-xl shadow-md p-5 hover:bg-blue-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-lg font-semibold text-[#20056a] flex items-center gap-2"><FaClipboardList className="text-[#20056a] animate-bounce" /> Manage Packages</span>
              <p className="text-sm text-gray-600 mt-1">Edit packages for each hall.</p>
            </Link>
            <Link href="/admin/bookings" className="block backdrop-blur-lg bg-white/60 rounded-xl shadow-md p-5 hover:bg-blue-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-lg font-semibold text-[#20056a] flex items-center gap-2"><FaClipboardList className="text-[#20056a] animate-bounce" /> Manage Bookings</span>
              <p className="text-sm text-gray-600 mt-1">View and update all bookings.</p>
            </Link>
            <Link href="/admin/customers-list" className="block backdrop-blur-lg bg-white/60 rounded-xl shadow-md p-5 hover:bg-blue-100 border border-gray-200 transition-transform duration-200 hover:scale-105">
              <span className="text-lg font-semibold text-[#20056a] flex items-center gap-2"><FaUsers className="text-[#20056a] animate-bounce" /> Manage Customers</span>
              <p className="text-sm text-gray-600 mt-1">View and manage customer details.</p>
            </Link>
          </nav>

          {/* Pending Hall Requests Section */}
          {hallRequests.length > 0 && (
            <section className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-yellow-600 flex items-center gap-2">
                  <FaClock /> Pending Hall Approvals ({hallRequests.length})
                </h2>
                <Link 
                  href="/admin/hall-requests" 
                  className="text-[#20056a] hover:text-[#20056a] font-semibold text-sm"
                >
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {hallRequests.slice(0, 3).map((request: any) => (
                  <div key={request.id} className="bg-white rounded-lg p-4 shadow border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            request.action_type === "add"
                              ? "bg-green-100 text-green-800"
                              : request.action_type === "edit"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {request.action_type.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800">
                          {request.action_type === "add" ? request.new_data?.name : request.hall_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          By: {request.vendor_name} ({request.vendor_business})
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {new Date(request.requested_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Show hall details for ADD requests */}
                    {request.action_type === "add" && request.new_data && (
                      <div className="bg-gray-50 rounded p-3 mb-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><span className="font-medium">Location:</span> {request.new_data.location}</div>
                          <div><span className="font-medium">Capacity:</span> {request.new_data.capacity}</div>
                          <div><span className="font-medium">Price:</span> ₹{request.new_data.price_per_day}/day</div>
                          <div><span className="font-medium">Contact:</span> {request.new_data.contact_number}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRequest(request.id, request.action_type)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(request.id, request.action_type)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1"
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {hallRequests.length > 3 && (
                <div className="mt-4 text-center">
                  <Link 
                    href="/admin/hall-requests" 
                    className="text-[#20056a] hover:text-[#20056a] font-semibold"
                  >
                    View {hallRequests.length - 3} more requests →
                  </Link>
                </div>
              )}
            </section>
          )}

          <section className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-[#20056a]">Get Started</h2>
            <p className="text-gray-700">Use the quick links above to manage halls, packages, bookings, and customers. More features coming soon!</p>
          </section>
        </main>

    </div>
  );
}
