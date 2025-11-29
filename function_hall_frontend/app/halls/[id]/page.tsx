"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import Image from "next/image";

export default function HallDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hallId = params.id;
  
  const [hall, setHall] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hallId) {
      // Fetch hall details
      fetch(`${BACKEND_URL}/api/halls/${hallId}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setHall(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Fetch hall error:', err);
          setHall(null);
          setLoading(false);
        });
      
      // Fetch packages
      fetch(`${BACKEND_URL}/api/halls/${hallId}/packages`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => setPackages(data))
        .catch(err => {
          console.error('❌ Fetch packages error:', err);
          setPackages([]);
        });
    }
  }, [hallId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading hall details...</div>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Hall not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Images */}
      <div className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600">
        {hall.photos && hall.photos.length > 0 ? (
          <div className="relative h-full w-full">
            <img
              src={hall.photos[0]}
              alt={hall.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-white text-8xl mb-4">🏛️</div>
            </div>
          </div>
        )}
        
        {/* Hall Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
          <h1 className="text-5xl font-bold text-white mb-2">{hall.name}</h1>
          <p className="text-xl text-white flex items-center">
            <span className="mr-2">📍</span>
            {hall.location}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {hall.photos && hall.photos.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hall.photos.slice(1).map((photo: string, index: number) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`${hall.name} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Hall</h2>
              <p className="text-gray-700 leading-relaxed">
                {hall.description || "A beautiful function hall perfect for all your celebration needs. Modern amenities and excellent service guaranteed."}
              </p>
            </div>

            {/* Packages */}
            {packages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="border-2 border-orange-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-md transition"
                    >
                      <h3 className="font-bold text-xl text-orange-600 mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                      <div className="text-2xl font-bold text-orange-500">₹{pkg.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hall Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">👤</span>
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <p className="font-semibold text-gray-800">{hall.owner_name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-semibold text-gray-800">{hall.capacity} Guests</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <p className="text-sm text-gray-500">Price Per Day</p>
                    <p className="font-semibold text-orange-600 text-2xl">₹{hall.price_per_day.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">📞</span>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-800">{hall.contact_number}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push(`/booking?hallId=${hallId}`)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition shadow-lg"
                >
                  Book Now
                </button>
                
                <button
                  onClick={() => router.push(`/customer/enquiry`)}
                  className="w-full bg-white text-orange-500 border-2 border-orange-500 py-3 rounded-lg font-bold text-lg hover:bg-orange-50 transition"
                >
                  Send Enquiry
                </button>

                <button
                  onClick={() => router.back()}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  ← Back to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
