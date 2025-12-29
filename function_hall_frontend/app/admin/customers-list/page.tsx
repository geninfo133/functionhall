"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/config";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  country_code?: string;
  aadhar_number?: string;
  is_phone_verified?: boolean;
  is_approved?: boolean;
  approval_status?: string;
}

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/customers`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        setError("Failed to fetch customers");
      }
    } catch (err) {
      setError("Error fetching customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#20056a]">Customer List</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-xl text-gray-600">No customers found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">#{customer.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.country_code && customer.country_code !== '+91' 
                        ? `${customer.country_code} ${customer.phone}`
                        : customer.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.address || "N/A"}</td>
                    <td className="px-6 py-4">
                      {customer.approval_status === 'approved' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : customer.approval_status === 'rejected' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          Rejected
                        </span>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                          <button
                            className="ml-2 px-3 py-1 rounded bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition"
                            onClick={async () => {
                              if (!confirm('Approve this customer?')) return;
                              const token = localStorage.getItem('adminToken');
                              if (!token) {
                                alert('Not authenticated. Please login again.');
                                router.push('/admin/login');
                                return;
                              }
                              try {
                                const res = await fetch(`${BACKEND_URL}/api/admin/customers/${customer.id}/approve`, {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                });
                                if (res.ok) {
                                  alert('Customer approved!');
                                  fetchCustomers();
                                } else {
                                  alert('Failed to approve customer');
                                }
                              } catch (err) {
                                alert('Error approving customer');
                              }
                            }}
                          >Approve</button>
                          <button
                            className="ml-2 px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
                            onClick={async () => {
                              const reason = prompt('Reject this customer? Enter reason (optional):');
                              if (reason === null) return;
                              const token = localStorage.getItem('adminToken');
                              if (!token) {
                                alert('Not authenticated. Please login again.');
                                router.push('/admin/login');
                                return;
                              }
                              try {
                                const res = await fetch(`${BACKEND_URL}/api/admin/customers/${customer.id}/reject`, {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ reason: reason || 'No reason provided' }),
                                });
                                if (res.ok) {
                                  alert('Customer rejected!');
                                  fetchCustomers();
                                } else {
                                  alert('Failed to reject customer');
                                }
                              } catch (err) {
                                alert('Error rejecting customer');
                              }
                            }}
                          >Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
