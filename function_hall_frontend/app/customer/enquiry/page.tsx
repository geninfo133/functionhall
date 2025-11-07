"use client";
import React, { useState } from "react";
import { BACKEND_URL } from "../../../lib/config";

export default function EnquiryPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
        setForm({ name: "", email: "", phone: "", message: "" });
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 rounded-xl shadow">
        <input name="name" value={form.name} onChange={handleInput} placeholder="Your Name" className="px-4 py-2 rounded-lg border" required />
        <input name="email" value={form.email} onChange={handleInput} type="email" placeholder="Email" className="px-4 py-2 rounded-lg border" required />
        <input name="phone" value={form.phone} onChange={handleInput} placeholder="Phone (optional)" className="px-4 py-2 rounded-lg border" />
        <textarea name="message" value={form.message} onChange={handleInput} placeholder="Your Message" className="px-4 py-2 rounded-lg border" required />
        <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition" disabled={loading}>
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
      </form>
    </div>
  );
}
