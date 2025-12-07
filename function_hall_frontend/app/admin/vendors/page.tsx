"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaBuilding, FaPhone, FaEnvelope, FaUserCheck, FaClock } from "react-icons/fa";
import { BACKEND_URL } from "../../../lib/config";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  is_approved: boolean;
  created_at: number;
}

export default function AdminVendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState<any>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

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
          if (data.admin.role !== 'super_admin') {
            setError("Only super admins can access vendor approvals");
            setTimeout(() => router.push('/admin/dashboard'), 2000);
            return;
          }
          setAdmin(data.admin);
          fetchVendors(token);
        } else {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchVendors = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors);
      } else {
        setError("Failed to fetch vendors");
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId: number, approve: boolean) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setProcessingId(vendorId);
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${vendorId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_approved: approve }),
      });

      if (response.ok) {
        // Update local state
        setVendors(vendors.map(v => 
          v.id === vendorId ? { ...v, is_approved: approve } : v
        ));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update vendor status");
      }
    } catch (err) {
      console.error('Error updating vendor:', err);
      setError("Network error. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading vendors...</div>
      </div>
    );
  }

  const pendingVendors = vendors.filter(v => !v.is_approved);
  const approvedVendors = vendors.filter(v => v.is_approved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Approve or manage vendor registrations</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingVendors.length}</p>
              </div>
              <FaClock className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Approved Vendors</p>
                <p className="text-3xl font-bold text-green-600">{approvedVendors.length}</p>
              </div>
              <FaUserCheck className="text-4xl text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Vendors</p>
                <p className="text-3xl font-bold text-blue-600">{vendors.length}</p>
              </div>
              <FaBuilding className="text-4xl text-blue-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Pending Vendors */}
        {pendingVendors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaClock className="text-yellow-500" />
              Pending Approval ({pendingVendors.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FaBuilding className="text-yellow-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{vendor.business_name}</h3>
                        <p className="text-sm text-gray-600">{vendor.name}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      Pending
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400" />
                      <span>{vendor.email}</span>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-gray-400" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(vendor.id, true)}
                      disabled={processingId === vendor.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                      <FaCheckCircle />
                      {processingId === vendor.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id, false)}
                      disabled={processingId === vendor.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                      <FaTimesCircle />
                      {processingId === vendor.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Vendors */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUserCheck className="text-green-500" />
            Approved Vendors ({approvedVendors.length})
          </h2>
          {approvedVendors.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
              No approved vendors yet
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {approvedVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-400 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaBuilding className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{vendor.business_name}</h3>
                        <p className="text-sm text-gray-600">{vendor.name}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <FaCheckCircle />
                      Approved
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400" />
                      <span>{vendor.email}</span>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-gray-400" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
