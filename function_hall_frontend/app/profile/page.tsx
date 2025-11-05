"use client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../lib/config";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get customerId from localStorage (simulate login)
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      setLoading(false);
      return;
    }
    fetch(`${BACKEND_URL}/api/customers`)
      .then(res => res.json())
      .then(data => {
        const user = data.find((c: any) => c.id === Number(customerId));
        setProfile(user);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-xl shadow p-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">My Profile</h2>
      {loading ? (
        <div>Loading...</div>
      ) : profile ? (
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Name:</span> {profile.name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span> {profile.email}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Phone:</span> {profile.phone}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Address:</span> {profile.address}
          </div>
        </div>
      ) : (
        <div>No profile found. Please log in.</div>
      )}
    </div>
  );
}
