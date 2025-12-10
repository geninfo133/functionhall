"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import { FaEnvelope, FaBuilding, FaClock, FaCheckCircle, FaHourglassHalf, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface Enquiry {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  hall_id: number;
  hall_name?: string;
  message: string;
  status: string;
  created_at: string;
}

export default function CustomerEnquiriesPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      
      if (!token) {
        router.push('/customer/login');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/customer/check-auth`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        localStorage.removeItem('customerToken');
        router.push('/customer/login');
        return;
      }

      const data = await response.json();
      if (data.authenticated && data.customer) {
        setCustomer(data.customer);
        fetchCustomerEnquiries(data.customer.id, data.customer.email);
      } else {
        localStorage.removeItem('customerToken');
        router.push('/customer/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('customerToken');
      router.push('/customer/login');
    }
  };

  const fetchCustomerEnquiries = async (customerId: number, customerEmail: string) => {
    try {
      // Fetch all halls first
      const hallsRes = await fetch(`${BACKEND_URL}/api/halls`);
      if (hallsRes.ok) {
        const hallsData = await hallsRes.json();
        setHalls(hallsData);
      }

      // Fetch all enquiries
      const enquiriesRes = await fetch(`${BACKEND_URL}/api/inquiries`);
      if (!enquiriesRes.ok) {
        setLoading(false);
        return;
      }

      const allEnquiries = await enquiriesRes.json();
      
      // Filter enquiries for this customer (by customer_id or email)
      const customerEnquiries = allEnquiries.filter((e: Enquiry) => 
        e.customer_id === customerId || e.email === customerEmail
      );

      // Add hall names
      const enrichedEnquiries = customerEnquiries.map((e: Enquiry) => {
        const hall = halls.find((h: any) => h.id === e.hall_id);
        return { ...e, hall_name: hall?.name || 'Unknown Hall' };
      });

      setEnquiries(enrichedEnquiries);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'responded':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600"></div>
          <p className="text-gray-600 font-medium">Loading your enquiries...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/home"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4"
          >
            <FaArrowLeft /> Back to Home
          </Link>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FaEnvelope className="text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">My Enquiries</h1>
                <p className="text-purple-100 mt-1">Track all your enquiries and responses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Enquiries</p>
                <p className="text-3xl font-bold text-indigo-600">{enquiries.length}</p>
              </div>
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FaEnvelope className="text-2xl text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {enquiries.filter(e => e.status?.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FaHourglassHalf className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Responded</p>
                <p className="text-3xl font-bold text-green-600">
                  {enquiries.filter(e => e.status?.toLowerCase() === 'responded').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries List */}
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <FaEnvelope className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No enquiries yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't sent any enquiries. Browse our halls and send your first enquiry!
              </p>
              <Link
                href="/halls"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Browse Halls
              </Link>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <FaBuilding className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {enquiry.hall_name}
                          </h3>
                          <p className="text-sm text-gray-500">Enquiry #{enquiry.id}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full border ${getStatusColor(enquiry.status)}`}>
                        {getStatusIcon(enquiry.status)}
                        {enquiry.status || 'Pending'}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-sm font-medium text-gray-600 mb-1">Your Message:</p>
                      <p className="text-gray-800">{enquiry.message}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <FaClock />
                        Sent on {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {enquiry.status?.toLowerCase() === 'pending' && (
                        <span className="text-yellow-600 font-medium">
                          Waiting for response...
                        </span>
                      )}
                      {enquiry.status?.toLowerCase() === 'responded' && (
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <FaCheckCircle /> Vendor has responded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Send New Enquiry Button */}
        {enquiries.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/customer/enquiry"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              <FaEnvelope /> Send New Enquiry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
