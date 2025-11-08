"use client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../lib/config";

export default function ProfilePage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number|null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/customers`)
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/customers`)
        .then(res => res.json())
        .then(data => {
          const user = data.find((c: any) => c.id === selectedId);
          setProfile(user);
          setLoading(false);
        });
    } else {
      setProfile(null);
    }
  }, [selectedId]);

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-xl shadow p-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Select Customer</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <select
            className="mb-6 px-4 py-2 rounded-lg border w-full"
            value={selectedId || ""}
            onChange={e => setSelectedId(Number(e.target.value))}
          >
            <option value="">-- Select a customer --</option>
            {customers.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
          {profile && (
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
          )}
        </div>
      )}
    </div>
  );
}
