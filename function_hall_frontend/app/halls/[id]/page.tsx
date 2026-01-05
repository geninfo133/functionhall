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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (hallId) {
      // Fetch hall details
      fetch(`${BACKEND_URL}/api/halls/${hallId}`, {
        cache: 'no-store'
      })
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
      console.log('🔗 Fetching packages from:', `${BACKEND_URL}/api/halls/${hallId}/packages`);
      fetch(`${BACKEND_URL}/api/halls/${hallId}/packages`, {
        cache: 'no-store'
      })
        .then(res => {
          console.log('📦 Packages response status:', res.status);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log('📦 Packages data received:', data);
          setPackages(data);
        })
        .catch(err => {
          console.error('❌ Fetch packages error:', err);
          setPackages([]);
        });
    }
  }, [hallId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-gray-600">Loading hall details...</div>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-red-600">Hall not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="relative h-32 bg-[#0d316cff] rounded-2xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-white text-8xl mb-4">🏛️</div>
          </div>
        </div>
        
        {/* Hall Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">🏛️</span>
            {hall.name}
          </h1>
          <p className="text-sm text-white flex items-center">
            <span className="mr-1">📍</span>
            {hall.location}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Photos and Hall Info */}
          <div className="lg:col-span-3">
            {/* Hall Information and Action Buttons - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Hall Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
                <h2 className="text-2xl font-bold text-[#20056a] mb-4">Hall Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">👤</span>
                    <div>
                      <p className="text-sm text-gray-500">Owner</p>
                      <p className="font-semibold text-[#20056a]">{hall.owner_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">👥</span>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-semibold text-[#20056a]">{hall.capacity} Guests</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💰</span>
                    <div>
                      <p className="text-sm text-gray-500">Price Per Day</p>
                      <p className="font-semibold text-[#20056a] text-2xl">₹{hall.price_per_day.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📞</span>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-semibold text-[#20056a]">{hall.contact_number}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-[#20056a] mb-3">Take Action</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push(`/booking?hallId=${hallId}`)}
                    className="w-full bg-[#20056a] text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-[#150442] transition shadow-lg"
                  >
                    📅 Book Now
                  </button>
                  
                  <button
                    onClick={() => router.push(`/customer/enquiry`)}
                    className="w-full bg-white text-[#20056a] border-2 border-blue-600 py-2 px-4 rounded-lg font-semibold text-sm hover:bg-blue-50 transition"
                  >
                    ✉️ Send Enquiry
                  </button>

                  <button
                    onClick={() => router.back()}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm hover:bg-gray-200 transition"
                  >
                    ← Back to List
                  </button>
                  
                  {/* Call to Action Banner */}
                  <div className="mt-3 bg-[#20056a] text-white rounded-xl p-3 text-center">
                    <p className="text-sm font-bold mb-0.5">🎉 Special Offer!</p>
                    <p className="text-purple-100 text-xs">Book now and get exclusive benefits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery and About This Hall - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Gallery */}
              {hall.photos && hall.photos.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[#20056a] mb-4">Photo Gallery</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {hall.photos.slice(0, 8).map((photo: string, index: number) => (
                      <div 
                        key={index} 
                        className="relative h-32 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(photo)}
                      >
                        <img
                          src={photo}
                          alt={`${hall.name} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[#20056a] mb-4">Photo Gallery</h2>
                  <p className="text-gray-500">No photos available</p>
                </div>
              )}

              {/* About This Hall */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#20056a] mb-4 flex items-center">
                  <span className="text-3xl mr-2">🏛️</span>
                  About This Hall
                </h2>
                
                <p className="text-gray-700 leading-relaxed text-sm">
                  {hall.description || "Experience elegance and sophistication in our beautifully designed function hall. Whether you're planning a grand wedding, corporate event, or special celebration, our venue offers the perfect blend of style, comfort, and exceptional service."}
                </p>

                {/* Key Highlights */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">✨</div>
                    <p className="text-xs font-semibold text-[#20056a]">Premium Ambiance</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🎵</div>
                    <p className="text-xs font-semibold text-[#20056a]">Sound & Lighting</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🍽️</div>
                    <p className="text-xs font-semibold text-[#20056a]">Catering</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🅿️</div>
                    <p className="text-xs font-semibold text-[#20056a]">Parking</p>
                  </div>
                </div>

                {/* Why Choose This Hall */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-[#20056a] mb-3">Why Choose This Hall?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-3 text-green-500">✓</span>
                      <span className="text-sm">Professional event coordination</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-3 text-green-500">✓</span>
                      <span className="text-sm">Modern air conditioning</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-3 text-green-500">✓</span>
                      <span className="text-sm">Elegant interior design</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-3 text-green-500">✓</span>
                      <span className="text-sm">Accessible location</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-3 text-green-500">✓</span>
                      <span className="text-sm">Flexible seating arrangements</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-xl mr-3 text-green-500">✓</span>
                      <span className="text-sm">24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Packages (Marquee) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 overflow-hidden">
              <h2 className="text-2xl font-bold text-[#20056a] mb-4 flex items-center">
                <span className="text-3xl mr-2">🎁</span>
                Available Packages
              </h2>
              
              {packages.length > 0 ? (
                <div className="relative h-[780px] overflow-hidden">
                  <style jsx>{`
                    @keyframes marquee {
                      0% { transform: translateY(0); }
                      100% { transform: translateY(-50%); }
                    }
                    .marquee-content {
                      animation: marquee 20s linear infinite;
                    }
                    .marquee-paused {
                      animation-play-state: paused !important;
                    }
                  `}</style>
                  <div 
                    className="marquee-content space-y-4"
                    id="packageMarquee"
                  >
                    {/* Duplicate packages for seamless loop */}
                    {[...packages, ...packages].map((pkg, index) => (
                      <div
                        key={`${pkg.id}-${index}`}
                        className="border-2 border-blue-200 rounded-lg p-4 bg-white cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:scale-105"
                        onMouseEnter={(e) => {
                          const marquee = document.getElementById('packageMarquee');
                          marquee?.classList.add('marquee-paused');
                        }}
                        onMouseLeave={(e) => {
                          const marquee = document.getElementById('packageMarquee');
                          marquee?.classList.remove('marquee-paused');
                        }}
                      >
                        <h3 className="font-bold text-lg text-[#20056a]">{pkg.package_name}</h3>
                        <div className="text-2xl font-bold text-[#20056a] mt-2">₹{pkg.price?.toLocaleString()}</div>
                        {pkg.details && (
                          <div className="text-gray-600 text-sm whitespace-pre-line leading-relaxed mt-3 pt-3 border-t border-gray-200">
                            {pkg.details}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-600 font-medium mb-2">No packages available yet</p>
                  <p className="text-gray-500 text-sm">Check back soon for special packages!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border-4 border-white"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold hover:bg-gray-200 transition shadow-xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
