"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
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
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Hero Header Card */}
            <div className="rounded-xl shadow-lg p-5 mb-6 text-white relative overflow-hidden" style={{ background: '#0d316cff' }}>
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg bg-white">
                    <img 
                      src="/hani1.jpg" 
                      alt={admin.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-2">
                    <Shield size={14} />
                    <span className="font-semibold text-xs uppercase tracking-wider">
                      Super Administrator
                    </span>
                  </div>
                  <h1 className="text-xl font-bold mb-1">
                    {admin.name}
                  </h1>
                  <p className="text-white/80 text-sm">
                    Welcome to your admin dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">Total Halls</p>
                    <p className="text-2xl font-bold" style={{ color: '#20056a' }}>0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                    <Calendar size={20} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">Total Users</p>
                    <p className="text-2xl font-bold" style={{ color: '#20056a' }}>0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                    <User size={20} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">Total Enquiries</p>
                    <p className="text-2xl font-bold" style={{ color: '#20056a' }}>0</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                    <Mail size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#20056a' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                  <User size={16} className="text-white" />
                </div>
                Profile Information
              </h2>

              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                      <User size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Full Name</p>
                      <p className="text-sm font-bold text-gray-800">{admin.name}</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                      <Mail size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium mb-1">Email Address</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{admin.email}</p>
                    </div>
                  </div>
                </div>

                {/* Admin ID */}
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                      <Shield size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">User ID</p>
                      <p className="text-sm font-bold text-gray-800">#{admin.id}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#20056a' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#20056a' }}>
                  <User size={16} className="text-white" />
                </div>
                About Admin
              </h2>
              <div className="bg-gray-50 rounded-lg p-5">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  <strong style={{ color: '#20056a' }}>Suhasini</strong> is the Super Administrator of this Function Hall Management System. With extensive experience in event management and venue operations, Suhasini oversees all aspects of the platform including hall bookings, vendor management, customer relations, and enquiry handling.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  As the primary administrator, Suhasini ensures smooth operations, maintains high service standards, and provides exceptional support to both customers and vendors. The role includes managing function hall listings, approving bookings, coordinating with vendors, and ensuring customer satisfaction throughout the event planning process.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
