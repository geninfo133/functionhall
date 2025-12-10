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
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Vendor List</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* All Vendors Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {vendors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No vendors found
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact Person</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{vendor.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">{vendor.business_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{vendor.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vendor.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vendor.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {vendor.is_approved ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                          <FaCheckCircle />
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                          <FaClock />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!vendor.is_approved ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleApprove(vendor.id, true)}
                            disabled={processingId === vendor.id}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
                          >
                            {processingId === vendor.id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleApprove(vendor.id, false)}
                            disabled={processingId === vendor.id}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-sm text-gray-500">-</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
