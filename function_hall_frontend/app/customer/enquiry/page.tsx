"use client";
import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../lib/config";

export default function EnquiryPage() {
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
    if (!form.name || !form.email || !form.message) {
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
        setSuccess("Your enquiry has been submitted. We will contact you soon.");
        setForm({ name: "", email: "", phone: "", message: "", hall_id: "" });
      } else {
        setError("Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-500 mb-4">Enquiry</h1>
      <p className="text-gray-600 mb-4">Send an enquiry to a hall owner. They will receive an SMS notification.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Hall</label>
          <select 
            name="hall_id" 
            value={form.hall_id} 
            onChange={handleInput} 
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">-- Select a Hall --</option>
            {halls.map(hall => (
              <option key={hall.id} value={hall.id}>
                {hall.name} - {hall.location}
              </option>
            ))}
          </select>
        </div>
        <input name="name" value={form.name} onChange={handleInput} placeholder="Your Name" className="px-4 py-2 rounded-lg border" required />
        <input name="email" value={form.email} onChange={handleInput} type="email" placeholder="Email" className="px-4 py-2 rounded-lg border" required />
        <input name="phone" value={form.phone} onChange={handleInput} placeholder="Phone Number" className="px-4 py-2 rounded-lg border" required />
        <textarea name="message" value={form.message} onChange={handleInput} placeholder="Your Message" className="px-4 py-2 rounded-lg border" rows={4} required />
        <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition" disabled={loading}>
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
      </form>
    </div>
  );
}
