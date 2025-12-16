"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../../components/Topbar";
import { BACKEND_URL } from "../../../lib/config";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalHalls, setTotalHalls] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEnquiries, setTotalEnquiries] = useState(0);

  useEffect(() => {
    const checkAuthAndFetchTotals = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        const response = await fetch(`${BACKEND_URL}/api/admin/check-auth`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        const data = await response.json();
        if (data.authenticated && data.admin) {
          setAdmin(data.admin);
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }

        // Fetch totals
        const [hallsRes, usersRes, enquiriesRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/halls`),
          fetch(`${BACKEND_URL}/api/customers`),
          fetch(`${BACKEND_URL}/api/inquiries`)
        ]);
        if (hallsRes.ok) {
          const halls = await hallsRes.json();
          setTotalHalls(Array.isArray(halls) ? halls.length : 0);
        }
        if (usersRes.ok) {
          const users = await usersRes.json();
          setTotalUsers(Array.isArray(users) ? users.length : 0);
        }
        if (enquiriesRes.ok) {
          const enquiries = await enquiriesRes.json();
          setTotalEnquiries(Array.isArray(enquiries) ? enquiries.length : 0);
        }
      } catch (error) {
        console.error('Auth check or fetch totals error:', error);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndFetchTotals();
  }, [router]);

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

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white">
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Compact Side-by-Side Hero Section */}
            <div className="flex flex-row items-center bg-blue-700 rounded-2xl shadow-lg p-6 mb-8 text-white gap-6 w-full max-w-2xl mx-auto">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <img 
                    src="/hani1.jpg" 
                    alt={admin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow"></div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full mb-1">
                  <Shield size={16} />
                  <span className="font-semibold text-xs uppercase tracking-wider">
                    {admin.role === 'super_admin' ? 'Super Administrator' : admin.role === 'vendor' ? 'Vendor Account' : 'Administrator'}
                  </span>
                </div>
                <h1 className="text-xl font-bold mb-0.5">
                  {admin.name}
                </h1>
                <p className="text-white/80 text-sm">{admin.email}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 justify-center items-center w-fit mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Halls</p>
                    <p className="text-3xl font-bold text-orange-600">{totalHalls}</p>
                  </div>
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <Calendar size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Enquiries</p>
                    <p className="text-3xl font-bold text-purple-600">{totalEnquiries}</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Mail size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                Profile Information
              </h2>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Full Name</p>
                      <p className="text-xl font-bold text-gray-800">{admin.name}</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Mail size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 font-medium mb-1">Email Address</p>
                      <p className="text-xl font-bold text-gray-800 truncate">{admin.email}</p>
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Shield size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Account Role</p>
                      <p className="text-xl font-bold text-gray-800 capitalize">{admin.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Admin ID */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Calendar size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">User ID</p>
                      <p className="text-xl font-bold text-gray-800">#{admin.id}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
