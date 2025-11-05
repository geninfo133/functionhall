"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BACKEND_URL } from "../../lib/config";

export default function AdminHallsPage() {
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  const fetchHalls = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/halls`)
      .then(res => res.json())
      .then(data => {
        setHalls(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Basic validation
    if (!form.name || !form.owner_name || !form.location || !form.capacity || !form.contact_number || !form.price_per_day) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/halls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          owner_name: form.owner_name,
          location: form.location,
          capacity: Number(form.capacity),
          contact_number: form.contact_number,
          price_per_day: Number(form.price_per_day),
          description: form.description
        })
      });
      if (res.ok) {
        setSuccess("Hall added successfully!");
        setShowModal(false);
        setForm({ name: "", owner_name: "", location: "", capacity: "", contact_number: "", price_per_day: "", description: "" });
        fetchHalls();
      } else {
        setError("Failed to add hall.");
      }
    } catch {
      setError("Network error.");
    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Manage Halls</h1>
      <div className="mb-6 flex justify-end">
        <button className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition" onClick={() => setShowModal(true)}>+ Add New Hall</button>
      </div>
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Owner</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Location</th>
              <th className="px-6 py-4 text-center font-semibold text-lg tracking-wide">Capacity</th>
              <th className="px-6 py-4 text-left font-semibold text-lg tracking-wide">Contact</th>
              <th className="px-6 py-4 text-right font-semibold text-lg tracking-wide">Price</th>
              <th className="px-6 py-4 text-center font-semibold text-lg tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {halls.map((hall, idx) => (
              <tr key={hall.id} className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition">
                <td className="px-6 py-4 font-semibold text-blue-700">{hall.name}</td>
                <td className="px-6 py-4">{hall.owner_name}</td>
                <td className="px-6 py-4">{hall.location}</td>
                <td className="px-6 py-4 text-center">{hall.capacity}</td>
                <td className="px-6 py-4">{hall.contact_number}</td>
                <td className="px-6 py-4 text-right font-bold text-blue-700">₹{hall.price_per_day}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-green-700 font-semibold hover:underline mr-4">Edit</button>
                  <button className="text-red-700 font-semibold hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Add New Hall */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-200 relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Add New Hall</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input name="name" value={form.name} onChange={handleInput} placeholder="Hall Name" className="px-4 py-2 rounded-lg border" required />
              <input name="owner_name" value={form.owner_name} onChange={handleInput} placeholder="Owner Name" className="px-4 py-2 rounded-lg border" required />
              <input name="location" value={form.location} onChange={handleInput} placeholder="Location" className="px-4 py-2 rounded-lg border" required />
              <input name="capacity" value={form.capacity} onChange={handleInput} type="number" placeholder="Capacity" className="px-4 py-2 rounded-lg border" required />
              <input name="contact_number" value={form.contact_number} onChange={handleInput} placeholder="Contact Number" className="px-4 py-2 rounded-lg border" required />
              <input name="price_per_day" value={form.price_per_day} onChange={handleInput} type="number" placeholder="Price Per Day" className="px-4 py-2 rounded-lg border" required />
              <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" className="px-4 py-2 rounded-lg border" />
              <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition mt-2">Add Hall</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
