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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg">
                <img 
                  src="/hani1.jpg" 
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{admin.name}</h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Shield size={16} className="text-orange-500" />
                  Administrator
                </p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <User size={18} className="text-orange-500" />
                    <span className="font-semibold">Full Name</span>
                  </div>
                  <p className="text-gray-800 text-lg">{admin.name}</p>
                </div>

                {/* Email */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail size={18} className="text-orange-500" />
                    <span className="font-semibold">Email Address</span>
                  </div>
                  <p className="text-gray-800 text-lg">{admin.email}</p>
                </div>

                {/* Role */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Shield size={18} className="text-orange-500" />
                    <span className="font-semibold">Role</span>
                  </div>
                  <p className="text-gray-800 text-lg capitalize">{admin.role}</p>
                </div>

                {/* Admin ID */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={18} className="text-orange-500" />
                    <span className="font-semibold">Admin ID</span>
                  </div>
                  <p className="text-gray-800 text-lg">#{admin.id}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Account Actions</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      localStorage.removeItem('adminToken');
                      router.push('/admin/login');
                    }}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                  <button 
                    onClick={() => router.push('/admin/dashboard')}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
