"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import RoleSidebar from "../../components/RoleSidebar";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaSearch, FaCalendarAlt, FaUsers } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information
          </p>
        </div>

        <div>
              {!editing ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaUser className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-lg font-semibold text-blue-700">{customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-semibold text-blue-700">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-semibold text-blue-700">{customer.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-lg font-semibold text-blue-700">{customer.address || "Not provided"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaUser className="text-blue-600" />
                      <span>Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="text-blue-600" />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="text-blue-600" />
                      <span>Phone</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-green-600 bg-green-50 p-3 rounded-lg">
                      {success}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center space-x-2 flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                      <FaSave />
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
                      }}
                      className="flex items-center justify-center space-x-2 flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      <FaTimes />
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
