"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaUsers, FaPlus } from "react-icons/fa";
import Link from "next/link";
import HallCards from "../../../components/HallCards";

export default function VendorDashboardPage() {
  const router = useRouter();
  const [vendorData, setVendorData] = useState<any>(null);
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    owner_name: "",
    location: "",
    capacity: "",
    contact_number: "",
    price_per_day: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("vendorToken");
    const storedVendor = localStorage.getItem("vendorData");

    if (!token || !storedVendor) {
      router.push("/vendor/login");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/check-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        localStorage.removeItem("vendorToken");
        localStorage.removeItem("vendorData");
        router.push("/vendor/login");
        return;
      }

      const data = await res.json();
      setVendorData(data.admin);

      // Check if vendor is approved
      if (!data.admin.is_approved) {
        // Show pending approval message
        setLoading(false);
        return;
      }

      // Fetch vendor's halls
      fetchVendorHalls(data.admin.id);
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/vendor/login");
    }
  };

  const fetchVendorHalls = async (vendorId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vendor/${vendorId}/halls`);
      if (res.ok) {
        const data = await res.json();
        setHalls(data);
      }
    } catch (err) {
      console.error("Failed to fetch halls:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    router.push("/vendor/login");
  };

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddHall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.location || !form.capacity || !form.price_per_day) {
      setError("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("vendorToken");

    try {
      const res = await fetch(`${BACKEND_URL}/api/halls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
          price_per_day: Number(form.price_per_day),
          vendor_id: vendorData.id
        })
      });

      if (res.ok) {
        setSuccess("Hall added successfully!");
        setForm({
          name: "",
          owner_name: "",
          location: "",
          capacity: "",
          contact_number: "",
          price_per_day: "",
          description: ""
        });
        setShowAddModal(false);
        fetchVendorHalls(vendorData.id);
      } else {
        setError("Failed to add hall");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  if (vendorData && !vendorData.is_approved) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your vendor account is awaiting admin approval. You'll receive an email once your account is activated.
          </p>
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Vendor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {vendorData?.name} - {vendorData?.business_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{halls.length}</div>
            <div className="text-gray-600 mt-1">Total Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-gray-600 mt-1">Active Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-purple-600">₹0</div>
            <div className="text-gray-600 mt-1">Total Revenue</div>
          </div>
        </div>

        {/* Halls Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">My Halls</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <FaPlus /> Add New Hall
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}

          <HallCards 
            halls={halls} 
            loading={false}
            onEdit={(hall) => {
              // TODO: Implement edit functionality
              console.log('Edit hall:', hall);
            }}
            onDelete={(hall) => {
              // TODO: Implement delete functionality
              console.log('Delete hall:', hall);
            }}
          />
        </div>
      </main>

      {/* Add Hall Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Hall</h2>
              <form onSubmit={handleAddHall} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="owner_name"
                    value={form.owner_name}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleInput}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day *</label>
                    <input
                      type="number"
                      name="price_per_day"
                      value={form.price_per_day}
                      onChange={handleInput}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={form.contact_number}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Add Hall
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
