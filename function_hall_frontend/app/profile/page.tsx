"use client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../lib/config";
import RoleSidebar from "../../components/RoleSidebar";
import Topbar from "../../components/Topbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    // Fetch logged-in user profile
    fetch(`${BACKEND_URL}/api/profile`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setEditForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || ""
        });
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
  }, []);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch(`${BACKEND_URL}/api/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RoleSidebar role="customer" />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-600">My Profile</h2>
            {loading ? (
              <div className="text-center text-gray-500">Loading profile...</div>
            ) : !profile ? (
              <div className="text-center text-red-500">Please log in to view your profile.</div>
            ) : (
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg border"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Address:</label>
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold text-gray-700">Name:</span> {profile.name}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Email:</span> {profile.email}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Phone:</span> {profile.phone || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Address:</span> {profile.address || "N/A"}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 mt-4"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
