"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import RoleSidebar from "../../components/RoleSidebar";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaSearch, FaCalendarAlt, FaUsers, FaQuestionCircle, FaPaperPlane } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if customer is logged in
    const customerInfo = localStorage.getItem("customerInfo");
    if (!customerInfo) {
      router.push("/customer/login");
      return;
    }
    
    const parsedCustomer = JSON.parse(customerInfo);
    setCustomer(parsedCustomer);
    setForm({
      name: parsedCustomer.name || "",
      email: parsedCustomer.email || "",
      phone: parsedCustomer.phone || "",
      address: parsedCustomer.address || ""
    });
  }, [router]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("customerToken");
      const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        // Update localStorage with new info
        const updatedCustomer = { ...customer, ...form };
        localStorage.setItem("customerInfo", JSON.stringify(updatedCustomer));
        setCustomer(updatedCustomer);
        setSuccess("Profile updated successfully!");
        setEditing(false);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
              <FaUser className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                Welcome back, {customer.name.split(' ')[0]}!
              </h1>
              <p className="text-purple-100 text-base">
                Manage your profile and view your activity
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-indigo-600">0</p>
              </div>
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <FaCalendarAlt className="text-2xl text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Inquiries Sent</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <FaSearch className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Venues Viewed</p>
                <p className="text-3xl font-bold text-pink-600">0</p>
              </div>
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center">
                <FaUsers className="text-2xl text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {!editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Full Name</p>
                        <p className="text-xl font-bold text-gray-800">{customer.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaEnvelope className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Email Address</p>
                        <p className="text-xl font-bold text-gray-800">{customer.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaPhone className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                        <p className="text-xl font-bold text-gray-800">{customer.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaMapMarkerAlt className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Address</p>
                        <p className="text-xl font-bold text-gray-800">{customer.address || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaUser className="text-indigo-600" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaEnvelope className="text-purple-600" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaPhone className="text-pink-600" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <span>Address</span>
                      </label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows={3}
                        placeholder="Your complete address"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <FaTimes className="text-white" />
                      </div>
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <FaSave className="text-white" />
                      </div>
                      <span className="font-medium">{success}</span>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <FaSave className="text-lg" />
                      <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          name: customer.name || "",
                          email: customer.email || "",
                          phone: customer.phone || "",
                          address: customer.address || ""
                        });
                        setError("");
                        setSuccess("");
                      }}
                      className="flex items-center justify-center gap-2 flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                      <FaTimes className="text-lg" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              )}
        </div>
      </div>
    </div>
  );
}
