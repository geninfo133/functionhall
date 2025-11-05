"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import { BACKEND_URL } from "../../../lib/config";

export default function AdminHallsPage() {
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/halls/${deleteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSuccess("Hall deleted successfully!");
        setShowDeleteModal(false);
        setDeleteId(null);
        fetchHalls();
      } else {
        setError("Failed to delete hall.");
      }
    } catch {
      setError("Network error.");
    }
  };
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
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [editForm, setEditForm] = useState({
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
  const handleEditInput = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
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
                      <button className="text-green-700 font-semibold hover:underline mr-4" onClick={() => {
                        setEditId(hall.id);
                        setEditForm({
                          name: hall.name,
                          owner_name: hall.owner_name,
                          location: hall.location,
                          capacity: hall.capacity,
                          contact_number: hall.contact_number,
                          price_per_day: hall.price_per_day,
                          description: hall.description || ""
                        });
                        setEditModal(true);
                      }}>Edit</button>
                      <button className="text-red-700 font-semibold hover:underline" onClick={() => { setDeleteId(hall.id); setShowDeleteModal(true); }}>Delete</button>
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

          {/* Modal for Edit Hall */}
          {editModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-200 relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setEditModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-blue-900">Edit Hall</h2>
                <form onSubmit={async (e: any) => {
                  e.preventDefault();
                  setError("");
                  setSuccess("");
                  if (!editForm.name || !editForm.owner_name || !editForm.location || !editForm.capacity || !editForm.contact_number || !editForm.price_per_day) {
                    setError("Please fill all required fields.");
                    return;
                  }
                  try {
                    const res = await fetch(`${BACKEND_URL}/api/halls/${editId}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: editForm.name,
                        owner_name: editForm.owner_name,
                        location: editForm.location,
                        capacity: Number(editForm.capacity),
                        contact_number: editForm.contact_number,
                        price_per_day: Number(editForm.price_per_day),
                        description: editForm.description
                      })
                    });
                    if (res.ok) {
                      setSuccess("Hall updated successfully!");
                      setEditModal(false);
                      fetchHalls();
                    } else {
                      setError("Failed to update hall.");
                    }
                  } catch {
                    setError("Network error.");
                  }
                }} className="grid grid-cols-1 gap-4">
                  <input name="name" value={editForm.name} onChange={handleEditInput} placeholder="Hall Name" className="px-4 py-2 rounded-lg border" required />
                  <input name="owner_name" value={editForm.owner_name} onChange={handleEditInput} placeholder="Owner Name" className="px-4 py-2 rounded-lg border" required />
                  <input name="location" value={editForm.location} onChange={handleEditInput} placeholder="Location" className="px-4 py-2 rounded-lg border" required />
                  <input name="capacity" value={editForm.capacity} onChange={handleEditInput} type="number" placeholder="Capacity" className="px-4 py-2 rounded-lg border" required />
                  <input name="contact_number" value={editForm.contact_number} onChange={handleEditInput} placeholder="Contact Number" className="px-4 py-2 rounded-lg border" required />
                  <input name="price_per_day" value={editForm.price_per_day} onChange={handleEditInput} type="number" placeholder="Price Per Day" className="px-4 py-2 rounded-lg border" required />
                  <textarea name="description" value={editForm.description} onChange={handleEditInput} placeholder="Description" className="px-4 py-2 rounded-lg border" />
                  <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-800 transition mt-2">Update Hall</button>
                </form>
              </div>
            </div>
          )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200 relative">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowDeleteModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4 text-red-700">Confirm Delete</h2>
              <p className="mb-6">Are you sure you want to delete this hall? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-400" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-800" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
