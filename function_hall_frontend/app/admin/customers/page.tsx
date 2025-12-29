"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/config";
import { FaUsers, FaArrowLeft, FaTrash, FaIdCard, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/auth/page");
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

  const approveCustomer = async (customerId: number, customerName: string) => {
    if (!confirm(`Approve customer "${customerName}"?`)) {
      return;
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      
      if (!adminToken) {
        alert("Not authenticated. Please login again.");
        window.location.href = "/admin/login";
        return;
      }
      
      const response = await fetch(`${BACKEND_URL}/api/admin/customers/${customerId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        alert("Customer approved successfully!");
        fetchCustomers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to approve customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error approving customer");
    }
  };

  const rejectCustomer = async (customerId: number, customerName: string) => {
    const reason = prompt(`Reject customer "${customerName}"?\nEnter rejection reason (optional):`);
    if (reason === null) return; // User cancelled

    try {
      const adminToken = localStorage.getItem("adminToken");
      
      if (!adminToken) {
        alert("Not authenticated. Please login again.");
        window.location.href = "/admin/login";
        return;
      }
      
      const response = await fetch(`${BACKEND_URL}/api/admin/customers/${customerId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ reason: reason || "No reason provided" }),
      });

      if (response.ok) {
        alert("Customer rejected successfully!");
        fetchCustomers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to reject customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting customer");
    }
  };

  const deleteCustomer = async (customerId: number, customerName: string) => {
    if (!confirm(`Are you sure you want to delete customer "${customerName}"? This will also delete all their bookings and inquiries.`)) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Customer deleted successfully!");
        fetchCustomers(); // Refresh the list
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete customer");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting customer");
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Customer List</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-xl text-gray-600">No customers found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#20056a] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaIdCard /> ID</div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaUser /> Name</div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaEnvelope /> Email</div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaPhone /> Phone</div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaMapMarkerAlt /> Address</div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaCheckCircle /> Status</div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2"><FaTrash /> Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.country_code && customer.country_code !== '+91' 
                          ? `${customer.country_code} ${customer.phone}`
                          : customer.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {customer.address || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {customer.approval_status === 'approved' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ✓ Approved
                          </span>
                        ) : customer.approval_status === 'rejected' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            ✗ Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {customer.approval_status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveCustomer(customer.id, customer.name)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectCustomer(customer.id, customer.name)}
                                className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition text-xs"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteCustomer(customer.id, customer.name)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1 text-xs"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Deleting a customer will permanently remove all their bookings and inquiries from the system.
          </p>
        </div>
    </div>
  );
}
