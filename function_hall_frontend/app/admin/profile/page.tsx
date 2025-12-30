"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { BACKEND_URL } from "../../../lib/config";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
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
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Header Card */}
            <div className="bg-[#150442] rounded-3xl shadow-2xl p-10 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                    <img 
                      src="/hani1.jpg" 
                      alt={admin.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#150442]/80 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
                    <Shield size={18} />
                    <span className="font-semibold text-sm uppercase tracking-wider">
                      {admin.role === 'super_admin' ? 'Super Administrator' : admin.role === 'vendor' ? 'Vendor Account' : 'Administrator'}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-2xl font-extrabold mb-2">
                    {admin.name}
                  </h1>
                  <p className="text-white/90 text-lg">
                    Welcome to your admin dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Halls</p>
                    <p className="text-3xl font-bold text-orange-600">0</p>
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
                    <p className="text-3xl font-bold text-[#20056a]">0</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <User size={24} className="text-[#20056a]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Enquiries</p>
                    <p className="text-3xl font-bold text-purple-600">0</p>
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
