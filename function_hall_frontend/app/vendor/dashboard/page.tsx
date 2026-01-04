"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import { PACKAGE_TEMPLATES } from "../../../lib/data";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaUsers, FaPlus, FaTachometerAlt, FaBuilding, FaPlusCircle, FaBox, FaCalendarCheck, FaEnvelope, FaCalendarAlt, FaUser, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import HallCards from "../../../components/HallCards";

export default function VendorDashboardPage() {
  const router = useRouter();
  const [vendorData, setVendorData] = useState<any>(null);
  const [halls, setHalls] = useState<any[]>([]);
  const [hallRequests, setHallRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    owner_name: "",
    location: "",
    capacity: "",
    contact_number: "",
    price_per_day: "",
    description: ""
  });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("vendorToken");
    const storedVendor = localStorage.getItem("vendorData");

    if (!token || !storedVendor) {
      router.push("/vendor/login");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });

      if (!res.ok) {
        localStorage.removeItem("vendorToken");
        localStorage.removeItem("vendorData");
        router.push("/vendor/login");
        return;
      }

      const data = await res.json();
      setVendorData(data.admin);

      // Check if vendor is approved
      if (!data.admin.is_approved) {
        // Show pending approval message
        setLoading(false);
        return;
      }

      // Fetch vendor's halls and requests
      fetchVendorHalls(data.admin.id);
      fetchVendorRequests(data.admin.id);
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/vendor/login");
    }
  };

  const fetchVendorHalls = async (vendorId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vendor/${vendorId}/halls`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setHalls(data);
      }
    } catch (err) {
      console.error("Failed to fetch halls:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorRequests = async (vendorId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/hall-requests?status=pending`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        // Filter to show only this vendor's requests
        const vendorRequests = data.filter((req: any) => req.vendor_id === vendorId);
        setHallRequests(vendorRequests);
      }
    } catch (err) {
      console.error("Failed to fetch hall requests:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    window.location.href = "/vendor/login";
  };

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 10 photos total
    const remainingSlots = 10 - photoFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Validate file types
    const validFiles = filesToAdd.filter(file => 
      file.type.startsWith('image/')
    );

    if (validFiles.length !== filesToAdd.length) {
      alert('Only image files are allowed');
    }

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setPhotoFiles([...photoFiles, ...validFiles]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(photoPreviews[index]);
    
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const handleEditClick = (hall: any) => {
    setSelectedHall(hall);
    setForm({
      name: hall.name,
      owner_name: hall.owner_name,
      location: hall.location,
      capacity: hall.capacity.toString(),
      contact_number: hall.contact_number,
      price_per_day: hall.price_per_day.toString(),
      description: hall.description || ""
    });
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setShowEditModal(true);
  };

  const handleEditHall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedHall) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("owner_name", form.owner_name);
      formData.append("location", form.location);
      formData.append("capacity", form.capacity);
      formData.append("price_per_day", form.price_per_day);
      formData.append("contact_number", form.contact_number);
      formData.append("description", form.description);
      formData.append("vendor_id", vendorData.id);

      photoFiles.forEach(file => {
        formData.append("photos", file);
      });

      const res = await fetch(`${BACKEND_URL}/api/vendor/halls/${selectedHall.id}/edit`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Edit request submitted! Pending admin approval.");
        setForm({
          name: "",
          owner_name: "",
          location: "",
          capacity: "",
          contact_number: "",
          price_per_day: "",
          description: ""
        });
        photoPreviews.forEach(url => URL.revokeObjectURL(url));
        setPhotoFiles([]);
        setPhotoPreviews([]);
        setSelectedHall(null);
        setShowEditModal(false);
        fetchVendorHalls(vendorData.id);
        fetchVendorRequests(vendorData.id);
        
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "Failed to submit edit request");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handleAddHall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.location || !form.capacity || !form.price_per_day) {
      setError("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("vendorToken");

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('owner_name', form.owner_name || '');
      formData.append('location', form.location);
      formData.append('capacity', form.capacity);
      formData.append('price_per_day', form.price_per_day);
      formData.append('contact_number', form.contact_number || '');
      formData.append('description', form.description || '');
      formData.append('vendor_id', vendorData.id.toString());
      
      // Append selected packages as JSON
      if (selectedPackages.length > 0) {
        formData.append('packages', JSON.stringify(selectedPackages));
      }
      
      // Append photo files
      photoFiles.forEach((file, index) => {
        formData.append('photos', file);
      });

      const res = await fetch(`${BACKEND_URL}/api/halls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess("Hall submission received! Your hall will be visible once approved by admin.");
        setForm({
          name: "",
          owner_name: "",
          location: "",
          capacity: "",
          contact_number: "",
          price_per_day: "",
          description: ""
        });
        // Clear photos and packages
        photoPreviews.forEach(url => URL.revokeObjectURL(url));
        setPhotoFiles([]);
        setPhotoPreviews([]);
        setSelectedPackages([]);
        setShowAddModal(false);
        fetchVendorHalls(vendorData.id);
        fetchVendorRequests(vendorData.id);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "Failed to add hall");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  if (vendorData && !vendorData.is_approved) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your vendor account is awaiting admin approval. You'll receive an email once your account is activated.
          </p>
          <button
            onClick={handleLogout}
            className="bg-[#20056a] hover:bg-[#150442] text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <div className="flex-1">
        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
        <div>
        {/* Header */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-12 relative" style={{ backgroundColor: '#0d316c' }}>
          <div className="px-6 sm:px-8 lg:px-12 py-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  Vendor Dashboard
                </h1>
                <p className="text-base text-blue-50 mb-1 font-light">
                  Welcome, {vendorData?.name} - {vendorData?.business_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-[#20056a]">{halls.length}</div>
            <div className="text-gray-600 mt-1">Approved Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{hallRequests.length}</div>
            <div className="text-gray-600 mt-1">Pending Approval</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-gray-600 mt-1">Active Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl font-bold text-purple-600">₹0</div>
            <div className="text-gray-600 mt-1">Total Revenue</div>
          </div>
        </div>

        {/* Pending Halls Section */}
        {hallRequests.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-600">⏳</span> Pending Approval ({hallRequests.length})
            </h2>
            <div className="space-y-3">
              {hallRequests.map((request: any) => (
                <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{request.new_data?.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {request.new_data?.location} | 
                        👥 Capacity: {request.new_data?.capacity} | 
                        💰 ₹{request.new_data?.price_per_day}/day
                      </p>
                      {request.new_data?.photos && Array.isArray(request.new_data.photos) && request.new_data.photos.length > 0 && (
                        <p className="text-xs text-[#20056a] mt-1">
                          📷 {request.new_data.photos.filter((p: string) => p && p.trim()).length} photo(s) attached
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Halls Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Approved Halls</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#20056a] hover:bg-[#150442] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <FaPlus /> Add New Hall
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}

          <HallCards 
            halls={halls} 
            loading={false}
            onEdit={handleEditClick}
            onDelete={(hall) => {
              // TODO: Implement delete functionality
              console.log('Delete hall:', hall);
            }}
          />
        </div>
        </div>
      </main>

      {/* Add Hall Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Hall</h2>
              <form onSubmit={handleAddHall} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="owner_name"
                    value={form.owner_name}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleInput}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day *</label>
                    <input
                      type="number"
                      name="price_per_day"
                      value={form.price_per_day}
                      onChange={handleInput}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={form.contact_number}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                
                {/* Package Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Packages (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg">
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
                        {selectedPackages.length} package{selectedPackages.length !== 1 ? 's' : ''} selected:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPackages.map((pkg, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-green-300">
                            {pkg.package_name} - ₹{pkg.price.toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hall Photos</label>
                  
                  {/* File Upload Button */}
                  <div className="mb-3">
                    <input
                      type="file"
                      id="photoUpload"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                      disabled={photoFiles.length >= 10}
                    />
                    <label
                      htmlFor="photoUpload"
                      className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition ${
                        photoFiles.length >= 10
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-blue-300 bg-blue-50 text-[#20056a] hover:bg-blue-100'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {photoFiles.length >= 10 ? 'Maximum 10 photos' : 'Choose Photos from Computer'}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Select up to 10 images (JPG, PNG, etc.) - {photoFiles.length}/10 selected
                    </p>
                  </div>

                  {/* Photo Previews */}
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                            {(photoFiles[index].size / 1024).toFixed(0)} KB
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      photoPreviews.forEach(url => URL.revokeObjectURL(url));
                      setPhotoFiles([]);
                      setPhotoPreviews([]);
                      setShowAddModal(false);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#20056a] hover:bg-[#150442] text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Add Hall
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hall Modal */}
      {showEditModal && selectedHall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Hall - {selectedHall.name}</h2>
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded mb-4">
                ⚠️ Changes require admin approval. Only fill in fields you want to change.
              </p>
              <form onSubmit={handleEditHall} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="owner_name"
                    value={form.owner_name}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleInput}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day</label>
                    <input
                      type="number"
                      name="price_per_day"
                      value={form.price_per_day}
                      onChange={handleInput}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={form.contact_number}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Current Photos */}
                {selectedHall.photos && selectedHall.photos.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Photos</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {selectedHall.photos.map((photo: string, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={photo}
                            alt={`Current ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Photos (Optional)</label>
                  
                  <div className="mb-3">
                    <input
                      type="file"
                      id="editPhotoUpload"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                      disabled={photoFiles.length >= 10}
                    />
                    <label
                      htmlFor="editPhotoUpload"
                      className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition ${
                        photoFiles.length >= 10
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-blue-300 bg-blue-50 text-[#20056a] hover:bg-blue-100'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {photoFiles.length >= 10 ? 'Maximum 10 photos' : 'Add New Photos'}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {photoFiles.length}/10 new photos selected
                    </p>
                  </div>

                  {/* New Photo Previews */}
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`New Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-green-300"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                            NEW
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      photoPreviews.forEach(url => URL.revokeObjectURL(url));
                      setPhotoFiles([]);
                      setPhotoPreviews([]);
                      setSelectedHall(null);
                      setShowEditModal(false);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#20056a] hover:bg-[#150442] text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Submit Edit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
