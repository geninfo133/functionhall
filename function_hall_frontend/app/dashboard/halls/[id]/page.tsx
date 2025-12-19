"use client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/config";

export default function HallDetails({ params }: { params: { id: string } }) {
  const [hall, setHall] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/halls/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setHall(data);
        }
      } catch (error) {
        console.error('Error fetching hall:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [params.id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!hall) return <div className="p-6">Hall not found</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">{hall.name}</h1>
      <p><strong>Location:</strong> {hall.location}</p>
      <p><strong>Capacity:</strong> {hall.capacity}</p>
      <p><strong>Price:</strong> ₹{hall.price_per_day}</p>
      {hall.description && <p className="mt-4"><strong>Description:</strong> {hall.description}</p>}

      {/* Marquee for packages */}
      {hall.packages && hall.packages.length > 0 && (
        <div className="mt-6">
          <strong>Packages:</strong>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              background: "#f0f4f8",
              padding: "8px 0",
              borderRadius: "6px",
              marginTop: "8px",
              whiteSpace: "nowrap"
            }}
          >
            {hall.packages.map((pkg: any, idx: number) => (
              <span key={pkg.id || idx} style={{ marginRight: 32 }}>
                <b>{pkg.package_name}</b> (₹{pkg.price}) - {pkg.details}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
