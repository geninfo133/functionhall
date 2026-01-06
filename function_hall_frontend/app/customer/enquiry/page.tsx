"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import { FaQuestionCircle, FaBuilding, FaUser, FaEnvelope, FaPhone, FaCommentAlt, FaPaperPlane, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function EnquiryPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    hall_id: ""
  });
  const [halls, setHalls] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if customer is logged in
    const customerInfo = localStorage.getItem("customerInfo");
    if (customerInfo) {
      const parsedCustomer = JSON.parse(customerInfo);
      setCustomer(parsedCustomer);
      setForm(prev => ({
        ...prev,
        name: parsedCustomer.name || "",
        email: parsedCustomer.email || "",
        phone: parsedCustomer.phone || ""
      }));
    }

    // Fetch all halls
    fetch(`${BACKEND_URL}/api/halls`)
      .then(res => res.json())
      .then(data => setHalls(data))
      .catch(err => console.error("Failed to fetch halls:", err));
  }, []);

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.email || !form.message || !form.hall_id) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess("Your enquiry has been submitted successfully! The hall owner will contact you soon.");
        // Keep user info but clear message and hall selection
        const customerInfo = localStorage.getItem("customerInfo");
        if (customerInfo) {
          const parsedCustomer = JSON.parse(customerInfo);
          setForm({
            name: parsedCustomer.name || "",
            email: parsedCustomer.email || "",
            phone: parsedCustomer.phone || "",
            message: "",
            hall_id: ""
          });
        } else {
          setForm({ name: "", email: "", phone: "", message: "", hall_id: "" });
        }
      } else {
        setError("Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div style={{ backgroundColor: '#0d316cff' }} className="rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
            >
              <FaArrowLeft /> Back
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                <FaQuestionCircle className="text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Send Enquiry</h1>
                <p className="text-purple-100">Get in touch with hall owners directly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 text-lg">Success!</h3>
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enquiry Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Enquiry Form</h2>
            <p className="text-gray-600">Fill out the form below and the hall owner will receive an SMS notification</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hall Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-indigo-600" />
                </div>
                <span>Select Hall</span>
                <span className="text-red-500">*</span>
              </label>
              <select 
                name="hall_id" 
                value={form.hall_id} 
                onChange={handleInput} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              >
                <option value="">-- Choose a Hall --</option>
                {halls.map(hall => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name} - {hall.location} (₹{hall.price_per_day.toLocaleString()}/day)
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaUser className="text-purple-600" />
                  </div>
                  <span>Your Name</span>
                  <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleInput} 
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                  required 
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-[#20056a]" />
                  </div>
                  <span>Email Address</span>
                  <span className="text-red-500">*</span>
                </label>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={handleInput} 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-pink-600" />
                </div>
                <span>Phone Number</span>
                <span className="text-red-500">*</span>
              </label>
              <input 
                name="phone" 
                value={form.phone} 
                onChange={handleInput} 
                placeholder="+91 XXXXX XXXXX" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition" 
                required 
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCommentAlt className="text-green-600" />
                </div>
                <span>Your Message</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="message" 
                value={form.message} 
                onChange={handleInput} 
                placeholder="Tell us about your event, preferred dates, number of guests, and any special requirements..." 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" 
                rows={6} 
                required 
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <FaQuestionCircle className="text-white" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#20056a] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#150442] hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3" 
              disabled={loading}
            >
              <FaPaperPlane className="text-xl" />
              <span>{loading ? "Sending..." : "Submit Enquiry"}</span>
            </button>
          </form>
        </div>
        </div>
      </main>
    </div>
  );
}
