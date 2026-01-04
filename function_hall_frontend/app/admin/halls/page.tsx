"use client";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../lib/config";
import { PACKAGE_TEMPLATES } from "../../../lib/data";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaUsers, FaStar, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import HallCards from "../../../components/HallCards";

export default function AdminHallsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [halls, setHalls] = useState<any[]>([]);
  const [filteredHalls, setFilteredHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchCapacity, setSearchCapacity] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<any[]>([]);
  const [editSelectedPackages, setEditSelectedPackages] = useState<any[]>([]);
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

  console.log('📦 PACKAGE_TEMPLATES available:', PACKAGE_TEMPLATES.length, 'packages');

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/halls`)
      .then(res => res.json())
      .then(data => {
        setHalls(data);
        setFilteredHalls(data);
        setLoading(false);
      });
  }, [showAddModal, showEditModal, showDeleteModal]);

  useEffect(() => {
    let filtered = [...halls];
    
    if (searchLocation) {
      filtered = filtered.filter(hall => 
        hall.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    if (searchCapacity) {
      filtered = filtered.filter(hall => 
        hall.capacity >= parseInt(searchCapacity)
      );
    }
    
    setFilteredHalls(filtered);
  }, [searchLocation, searchCapacity, halls]);

  const handleClearFilters = () => {
    setSearchLocation("");
    setSearchDate("");
    setSearchCapacity("");
  };

  const handleAdd = () => {
    setForm({ name: "", owner_name: "", location: "", capacity: "", contact_number: "", price_per_day: "", description: "" });
    setSelectedPackages([]);
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
    
    // Fetch packages for this hall
    fetch(`${BACKEND_URL}/api/halls/${hall.id}/packages`)
      .then(res => res.json())
      .then(data => {
        const packageIds = data.map((pkg: any) => pkg.id);
        setEditSelectedPackages(packageIds);
      })
      .catch(err => console.error('Error fetching hall packages:', err));
    
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
          description: form.description,
          packages: selectedPackages,
          is_admin: true
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
          description: editForm.description,
          packages: editSelectedPackages
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="p-4 sm:p-6 lg:p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#20056a]">All Halls</h2>
            <div className="flex gap-3">
              <Link href="/admin/hall-requests" className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition flex items-center gap-2">
                <span>⏳</span> Pending Approvals
              </Link>
              <button className="bg-[#20056a] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#150442] transition" onClick={handleAdd}>+ Add New Hall</button>
            </div>
          </div>

          {/* Search Filters */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="px-6 sm:px-8 lg:px-12 py-3">
              <div className="max-w-6xl mx-auto">
                <div className="text-center">
                  <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                    Search Function Halls
                  </h2>
                  <p className="text-xs text-blue-100 mt-1 max-w-2xl mx-auto">
                    Find and manage your function halls
                  </p>
                </div>

                <div className="mt-2">
                  <div className="bg-white rounded-xl shadow-lg p-3 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="City or area"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="pl-2.5 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Event Date</label>
                        <input
                          type="date"
                          value={searchDate}
                          onChange={(e) => setSearchDate(e.target.value)}
                          className="pl-2.5 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                        <input
                          type="number"
                          placeholder="How many?"
                          value={searchCapacity}
                          onChange={(e) => setSearchCapacity(e.target.value)}
                          className="pl-2.5 pr-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 w-full placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>

                      <div className="flex gap-2 items-end">
                        <button
                          type="button"
                          className="flex-1 bg-[#20056a] hover:bg-[#150442] text-white font-semibold py-1.5 text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                        >
                          Search
                        </button>
                        {(searchLocation || searchDate || searchCapacity) && (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-2.5 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    {(searchLocation || searchCapacity) && (
                      <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredHalls.length} of {halls.length} halls
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Display halls using HallCards component */}
          <HallCards halls={filteredHalls} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-blue-50/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-[#20056a]">Add New Hall</h2>
                <form onSubmit={submitAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" value={form.name} onChange={handleInput} placeholder="Hall Name" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="owner_name" value={form.owner_name} onChange={handleInput} placeholder="Owner Name" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="location" value={form.location} onChange={handleInput} placeholder="Location" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="capacity" value={form.capacity} onChange={handleInput} type="number" placeholder="Capacity" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="contact_number" value={form.contact_number} onChange={handleInput} placeholder="Contact Number" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="price_per_day" value={form.price_per_day} onChange={handleInput} type="number" placeholder="Price Per Day" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 md:col-span-2" />
                  
                  {/* Package Selection */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Packages</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {PACKAGE_TEMPLATES.map((pkg, index) => {
                        const isSelected = selectedPackages.some(p => p.package_name === pkg.package_name);
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedPackages(selectedPackages.filter(p => p.package_name !== pkg.package_name));
                              } else {
                                setSelectedPackages([...selectedPackages, pkg]);
                              }
                            }}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition hover:shadow-md ${
                              isSelected
                                ? "border-[#20056a] bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-bold text-sm text-gray-800">{pkg.package_name}</h4>
                              {isSelected && (
                                <FaCheckCircle className="text-[#20056a] text-lg" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pkg.details}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                              <span className="text-xs text-gray-500">Price</span>
                              <span className="text-[#20056a] font-bold text-sm">₹{pkg.price.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedPackages.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-semibold mb-2">
                          {selectedPackages.length} package{selectedPackages.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPackages.map((pkg, idx) => (
                            <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-green-300">
                              {pkg.package_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button type="submit" className="bg-[#20056a] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#150442] transition mt-2 md:col-span-2">Add Hall</button>
                  {error && <div className="text-red-500 font-semibold mt-2 md:col-span-2">{error}</div>}
                  {success && <div className="text-green-500 font-semibold mt-2 md:col-span-2">{success}</div>}
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedHall && (
            <div className="fixed inset-0 bg-blue-50/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowEditModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-[#20056a]">Edit Hall</h2>
                <form onSubmit={submitEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" value={editForm.name} onChange={handleEditInput} placeholder="Hall Name" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="owner_name" value={editForm.owner_name} onChange={handleEditInput} placeholder="Owner Name" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="location" value={editForm.location} onChange={handleEditInput} placeholder="Location" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="capacity" value={editForm.capacity} onChange={handleEditInput} type="number" placeholder="Capacity" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="contact_number" value={editForm.contact_number} onChange={handleEditInput} placeholder="Contact Number" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <input name="price_per_day" value={editForm.price_per_day} onChange={handleEditInput} type="number" placeholder="Price Per Day" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400" required />
                  <textarea name="description" value={editForm.description} onChange={handleEditInput} placeholder="Description" className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 md:col-span-2" />
                  
                  {/* Package Selection */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Packages</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {PACKAGE_TEMPLATES.map((pkg, index) => {
                        const isSelected = editSelectedPackages.some(p => p.package_name === pkg.package_name);
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              if (isSelected) {
                                setEditSelectedPackages(editSelectedPackages.filter(p => p.package_name !== pkg.package_name));
                              } else {
                                setEditSelectedPackages([...editSelectedPackages, pkg]);
                              }
                            }}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition hover:shadow-md ${
                              isSelected
                                ? "border-[#20056a] bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-bold text-sm text-gray-800">{pkg.package_name}</h4>
                              {isSelected && (
                                <FaCheckCircle className="text-[#20056a] text-lg" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pkg.details}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                              <span className="text-xs text-gray-500">Price</span>
                              <span className="text-[#20056a] font-bold text-sm">₹{pkg.price.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {editSelectedPackages.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-semibold mb-2">
                          {editSelectedPackages.length} package{editSelectedPackages.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {editSelectedPackages.map((pkg, idx) => (
                            <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-green-300">
                              {pkg.package_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button type="submit" className="bg-[#20056a] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#150442] transition mt-2 md:col-span-2">Update Hall</button>
                  {error && <div className="text-red-500 font-semibold mt-2">{error}</div>}
                  {success && <div className="text-green-500 font-semibold mt-2">{success}</div>}
                </form>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {showDeleteModal && selectedHall && (
            <div className="fixed inset-0 bg-blue-50/85 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-gray-200 relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowDeleteModal(false)}>&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-[#20056a]">Delete Hall</h2>
                <div className="text-gray-700 mb-4">Are you sure you want to delete <span className="font-bold">{selectedHall.name}</span>?</div>
                <div className="flex gap-4 justify-end">
                  <button className="bg-[#20056a] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#150442]" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button className="bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-red-600" onClick={submitDelete}>Delete</button>
                </div>
                {error && <div className="text-red-500 font-semibold mt-2">{error}</div>}
                {success && <div className="text-green-500 font-semibold mt-2">{success}</div>}
              </div>
            </div>
          )}
        </main>
    </div>
  );
}
