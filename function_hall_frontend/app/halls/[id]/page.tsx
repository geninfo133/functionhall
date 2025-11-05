"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";

import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";

export default function HallDetailsPage() {
  const { id } = useParams();
  const [hall, setHall] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
  // TODO: partners, services, dates

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/halls/${id}`)
      .then(res => res.json())
      .then(data => {
        setHall(data);
        setLoading(false);
      });
    fetch(`${BACKEND_URL}/api/halls/${id}/packages`)
      .then(res => res.json())
      .then(data => setPackages(data));
    // TODO: fetch partners, services, dates
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!hall) return <div className="p-8">Hall not found.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-8 mb-8">
            {/* Photo Gallery */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-blue-900 mb-4">{hall.name}</h1>
              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(hall.photos && hall.photos.length > 0 ? hall.photos : ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"]).map((url: string, idx: number) => (
                    <img key={idx} src={url} alt={hall.name} className="w-full h-40 object-cover rounded-xl" />
                  ))}
                </div>
                <div className="text-gray-500 text-sm mt-2">{hall.photos ? hall.photos.length : 1} image{(hall.photos && hall.photos.length !== 1) ? 's' : ''} displayed</div>
              </div>
              <div className="flex flex-wrap gap-6 mb-4">
                  <span className="text-gray-700">Owner: <b>{hall.owner_name || "-"}</b></span>
                  <span className="text-gray-700">Location: <b>{hall.location}</b></span>
                  <span className="text-gray-700">Capacity: <b>{hall.capacity}</b></span>
                  <span className="text-gray-700">Contact: <b>{hall.contact_number}</b></span>
                  <span className="text-blue-700 font-bold">₹{hall.price_per_day}</span>
              </div>
              <p className="text-gray-700 mb-4">{hall.description}</p>
            </div>

            {/* Packages */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">Packages</h2>
              {packages.length === 0 ? (
                <p className="text-gray-500">No packages available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg: any) => (
                    <div key={pkg.id} className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-bold text-blue-700 mb-1">{pkg.package_name}</h3>
                      <p className="text-gray-700 mb-1">₹{pkg.price}</p>
                      <p className="text-gray-500 text-sm">{pkg.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Partners, Services, Dates - Placeholders */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Partners & Services</h2>
              <p className="text-gray-500">Coming soon: partners, services, and available dates.</p>
            </div>

            {/* Book Button */}
            <div className="flex justify-end">
              <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition">Book Now</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
