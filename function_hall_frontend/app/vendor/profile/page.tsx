"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import { User, Mail, Phone, Building2, MapPin, Calendar, IndianRupee, FileText, Shield, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function VendorProfilePage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState({
    totalHalls: 0,
    pendingRequests: 0,
    activeBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('vendorToken');
        
        if (!token) {
          router.push('/vendor/login');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/admin/check-auth`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          localStorage.removeItem('vendorToken');
          localStorage.removeItem('vendorData');
          router.push('/vendor/login');
          return;
        }

        const data = await response.json();
        if (data.authenticated && data.admin) {
          setVendor(data.admin);
          fetchVendorStats(data.admin.id);
        } else {
          localStorage.removeItem('vendorToken');
          localStorage.removeItem('vendorData');
          router.push('/vendor/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
        router.push('/vendor/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchVendorStats = async (vendorId: number) => {
    try {
      // Fetch vendor's halls
      const hallsRes = await fetch(`${BACKEND_URL}/api/vendor/${vendorId}/halls`);
      if (hallsRes.ok) {
        const hallsData = await hallsRes.json();
        setStats(prev => ({ ...prev, totalHalls: hallsData.length }));
      }

      // Fetch pending requests
      const requestsRes = await fetch(`${BACKEND_URL}/api/admin/hall-requests?status=pending`);
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        const vendorRequests = requestsData.filter((req: any) => req.vendor_id === vendorId);
        setStats(prev => ({ ...prev, pendingRequests: vendorRequests.length }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    router.push('/vendor/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/vendor/dashboard" className="text-[#20056a] hover:text-[#20056a] font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Building2 size={32} className="text-white" />
                </div>
              </div>
              {vendor.is_approved && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <CheckCircle size={20} className="text-white" />
                </div>
              )}
              {!vendor.is_approved && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <Clock size={20} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                <Building2 size={14} />
                <span className="font-semibold text-xs uppercase tracking-wider">Vendor Account</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                {vendor.name}
              </h1>
              <p className="text-white/90 text-base mb-1">
                {vendor.business_name || 'Function Hall Vendor'}
              </p>
              {vendor.is_approved ? (
                <div className="inline-flex items-center gap-1 bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <CheckCircle size={14} />
                  <span className="font-medium text-xs">Verified Vendor</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Clock size={14} />
                  <span className="font-medium text-xs">Pending Approval</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Halls</p>
                <p className="text-3xl font-bold text-[#20056a]">{stats.totalHalls}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Building2 size={24} className="text-[#20056a]" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <TrendingUp size={14} className="text-green-600" />
              <span>Approved venues</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <FileText size={14} className="text-yellow-600" />
              <span>Awaiting approval</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Active Bookings</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeBookings}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <Calendar size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={14} className="text-green-600" />
              <span>Current reservations</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <IndianRupee size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <TrendingUp size={14} className="text-green-600" />
              <span>Lifetime earnings</span>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            Vendor Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Building2 size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 font-medium mb-1">Business Name</p>
                  <p className="text-xl font-bold text-gray-800 truncate">
                    {vendor.business_name || vendor.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Contact Person</p>
                  <p className="text-xl font-bold text-gray-800">{vendor.name}</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Mail size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 font-medium mb-1">Email Address</p>
                  <p className="text-xl font-bold text-gray-800 truncate">{vendor.email}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Phone Number</p>
                  <p className="text-xl font-bold text-gray-800">
                    {vendor.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            {vendor.location && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 font-medium mb-1">Location</p>
                    <p className="text-xl font-bold text-gray-800 truncate">{vendor.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Status */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Account Status</p>
                  <p className="text-xl font-bold text-gray-800 capitalize">
                    {vendor.is_approved ? (
                      <span className="text-green-600 flex items-center gap-2">
                        <CheckCircle size={20} /> Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center gap-2">
                        <Clock size={20} /> Pending
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Vendor ID */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-gray-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Vendor ID</p>
                  <p className="text-xl font-bold text-gray-800">#{vendor.id}</p>
                </div>
              </div>
            </div>

            {/* Registration Date */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl p-6 hover:shadow-lg transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Member Since</p>
                  <p className="text-xl font-bold text-gray-800">
                    {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approval Notice */}
        {!vendor.is_approved && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-800 mb-2">Account Pending Approval</h3>
                <p className="text-gray-700 mb-3">
                  Your vendor account is currently under review by our admin team. Once approved, you'll be able to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>List and manage your function halls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Receive and manage bookings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Track revenue and performance</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  You'll receive an email notification once your account is approved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
