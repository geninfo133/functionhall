"use client";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../lib/config";
import { FaCheckCircle, FaTimesCircle, FaBuilding, FaUser, FaClock } from "react-icons/fa";

interface HallRequest {
  id: number;
  hall_id: number | null;
  hall_name: string | null;
  vendor_id: number;
  vendor_name: string;
  vendor_business: string;
  action_type: string;
  status: string;
  old_data: any;
  new_data: any;
  requested_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export default function AdminHallRequestsPage() {
  const [hallRequests, setHallRequests] = useState<HallRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");

  useEffect(() => {
    fetchHallRequests();
  }, [filter]);

  const fetchHallRequests = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/hall-requests?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setHallRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch hall requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: number, actionType: string) => {
    if (!confirm(`Approve this ${actionType} request?`)) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Not authenticated. Please login again.");
        window.location.href = "/admin/login";
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/admin/hall-requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Request approved successfully!");
        fetchHallRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      alert("Error approving request");
    }
  };

  const rejectRequest = async (requestId: number, actionType: string) => {
    const reason = prompt(`Reject this ${actionType} request?\nEnter rejection reason (optional):`);
    if (reason === null) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Not authenticated. Please login again.");
        window.location.href = "/admin/login";
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/admin/hall-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reason || "No reason provided" }),
      });

      if (res.ok) {
        alert("Request rejected successfully!");
        fetchHallRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reject request");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBuilding className="text-blue-600" />
            Vendor Hall Requests
          </h1>
          <p className="text-gray-600 mt-2">Manage vendor hall addition, edit, and deletion requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setFilter("pending")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                filter === "pending"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaClock className="inline mr-2" />
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                filter === "approved"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaCheckCircle className="inline mr-2" />
              Approved
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                filter === "rejected"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaTimesCircle className="inline mr-2" />
              Rejected
            </button>
          </div>
        </div>

        {/* Requests List */}
        {hallRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No {filter} requests</h3>
            <p className="text-gray-500">There are no {filter} hall requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hallRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.action_type === "add"
                          ? "bg-green-100 text-green-800"
                          : request.action_type === "edit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {request.action_type.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {request.action_type === "add" ? request.new_data?.name : request.hall_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <FaUser /> {request.vendor_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBuilding /> {request.vendor_business}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Requested: {new Date(request.requested_at).toLocaleDateString()}</p>
                    {request.reviewed_at && (
                      <p>Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                {/* Hall Details */}
                {request.action_type === "add" && request.new_data && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">New Hall Details:</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="font-medium">Location:</span> {request.new_data.location}</div>
                      <div><span className="font-medium">Capacity:</span> {request.new_data.capacity} people</div>
                      <div><span className="font-medium">Price/Day:</span> ₹{request.new_data.price_per_day}</div>
                      <div><span className="font-medium">Contact:</span> {request.new_data.contact_number}</div>
                    </div>
                    {request.new_data.description && (
                      <p className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Description:</span> {request.new_data.description}
                      </p>
                    )}
                    {request.new_data.photos && request.new_data.photos.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium text-sm">Photos ({request.new_data.photos.filter((p: string) => p && p.trim()).length}):</span>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {request.new_data.photos.filter((p: string) => p && p.trim()).map((photo: string, idx: number) => {
                            // Convert relative path to full URL if needed
                            const photoUrl = photo.startsWith('/uploads/') 
                              ? `http://localhost:5000${photo}` 
                              : photo;
                            return (
                              <img
                                key={idx}
                                src={photoUrl}
                                alt={`Hall photo ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {request.action_type === "edit" && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Old Details:</h4>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(request.old_data, null, 2)}
                      </pre>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">New Details:</h4>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(request.new_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {request.action_type === "delete" && request.old_data && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-800 mb-2">Hall to be deleted:</h4>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(request.old_data, null, 2)}
                    </pre>
                  </div>
                )}

                {request.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <span className="font-semibold text-red-800">Rejection Reason:</span>
                    <p className="text-sm text-gray-700 mt-1">{request.rejection_reason}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {request.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => approveRequest(request.id, request.action_type)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => rejectRequest(request.id, request.action_type)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
