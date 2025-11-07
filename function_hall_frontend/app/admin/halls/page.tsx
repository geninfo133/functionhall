"use client";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import HallTable from "../../../components/HallTable";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../lib/config";

export default function AdminHallsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    owner_name: "",
    location: "",
    capacity: "",
    contact_number: "",
    price_per_day: "",
    description: ""
  });
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

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/halls`)
      .then(res => res.json())
      .then(data => {
        setHalls(data);
        setLoading(false);
      });
  }, [showAddModal, showEditModal, showDeleteModal]);

  const handleAdd = () => {
    setForm({ name: "", owner_name: "", location: "", capacity: "", contact_number: "", price_per_day: "", description: "" });
    setShowAddModal(true);
  };
  const handleEdit = (hall: any) => {
    setSelectedHall(hall);
    setEditForm({
      name: hall.name,
      owner_name: hall.owner_name,
      location: hall.location,
      capacity: hall.capacity,
      contact_number: hall.contact_number,
      price_per_day: hall.price_per_day,
      description: hall.description || ""
    });
    setShowEditModal(true);
  };
  const handleDelete = (hall: any) => {
    setSelectedHall(hall);
    setShowDeleteModal(true);
  };

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleEditInput = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitAdd = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
        setShowAddModal(false);
      } else {
        setError("Failed to add hall.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const submitEdit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!editForm.name || !editForm.owner_name || !editForm.location || !editForm.capacity || !editForm.contact_number || !editForm.price_per_day) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/halls/${selectedHall.id}`, {
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
        setShowEditModal(false);
      } else {
        setError("Failed to update hall.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const submitDelete = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/halls/${selectedHall.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSuccess("Hall deleted successfully!");
        setShowDeleteModal(false);
      } else {
        setError("Failed to delete hall.");
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
        <main className="p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-orange-500">Manage Halls</h1>
            <button className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition" onClick={handleAdd}>+ Add New Hall</button>
          </div>
          {/* Pass handlers to HallTable for row actions (to be implemented in HallTable) */}
          <HallTable halls={halls} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-200 relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-orange-500">Add New Hall</h2>
                <form onSubmit={submitAdd} className="grid grid-cols-1 gap-4">
                  <input name="name" value={form.name} onChange={handleInput} placeholder="Hall Name" className="px-4 py-2 rounded-lg border" required />
                  <input name="owner_name" value={form.owner_name} onChange={handleInput} placeholder="Owner Name" className="px-4 py-2 rounded-lg border" required />
                  <input name="location" value={form.location} onChange={handleInput} placeholder="Location" className="px-4 py-2 rounded-lg border" required />
                  <input name="capacity" value={form.capacity} onChange={handleInput} type="number" placeholder="Capacity" className="px-4 py-2 rounded-lg border" required />
                  <input name="contact_number" value={form.contact_number} onChange={handleInput} placeholder="Contact Number" className="px-4 py-2 rounded-lg border" required />
                  <input name="price_per_day" value={form.price_per_day} onChange={handleInput} type="number" placeholder="Price Per Day" className="px-4 py-2 rounded-lg border" required />
                  <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" className="px-4 py-2 rounded-lg border" />
                  <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition mt-2">Add Hall</button>
                  {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
                  {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedHall && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-200 relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowEditModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-orange-500">Edit Hall</h2>
                <form onSubmit={submitEdit} className="grid grid-cols-1 gap-4">
                  <input name="name" value={editForm.name} onChange={handleEditInput} placeholder="Hall Name" className="px-4 py-2 rounded-lg border" required />
                  <input name="owner_name" value={editForm.owner_name} onChange={handleEditInput} placeholder="Owner Name" className="px-4 py-2 rounded-lg border" required />
                  <input name="location" value={editForm.location} onChange={handleEditInput} placeholder="Location" className="px-4 py-2 rounded-lg border" required />
                  <input name="capacity" value={editForm.capacity} onChange={handleEditInput} type="number" placeholder="Capacity" className="px-4 py-2 rounded-lg border" required />
                  <input name="contact_number" value={editForm.contact_number} onChange={handleEditInput} placeholder="Contact Number" className="px-4 py-2 rounded-lg border" required />
                  <input name="price_per_day" value={editForm.price_per_day} onChange={handleEditInput} type="number" placeholder="Price Per Day" className="px-4 py-2 rounded-lg border" required />
                  <textarea name="description" value={editForm.description} onChange={handleEditInput} placeholder="Description" className="px-4 py-2 rounded-lg border" />
                  <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition mt-2">Update Hall</button>
                  {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
                  {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
                </form>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && selectedHall && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-200 relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowDeleteModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-orange-500">Delete Hall</h2>
                <div className="text-gray-600 mb-4">Are you sure you want to delete <span className="font-bold">{selectedHall.name}</span>?</div>
                <div className="flex gap-4 justify-end">
                  <button className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-400" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button className="bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-800" onClick={submitDelete}>Delete</button>
                </div>
                {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
                {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
