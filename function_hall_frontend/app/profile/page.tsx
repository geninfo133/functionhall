"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";
import RoleSidebar from "../../components/RoleSidebar";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";

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
    <div className="flex min-h-screen bg-gray-50">
      <RoleSidebar role="customer" />
      <div className="flex-1">
        <main className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <FaUser className="text-orange-500 text-3xl" />
              <h1 className="text-3xl font-bold text-orange-500">My Profile</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow p-8">
              {!editing ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaUser className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-lg font-semibold text-gray-800">{customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-semibold text-gray-800">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-semibold text-gray-800">{customer.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-orange-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-lg font-semibold text-gray-800">{customer.address || "Not provided"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaUser className="text-orange-500" />
                      <span>Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="text-orange-500" />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="text-orange-500" />
                      <span>Phone</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span>Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
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
                      className="flex items-center justify-center space-x-2 flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
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
        </main>
      </div>
    </div>
  );
}
