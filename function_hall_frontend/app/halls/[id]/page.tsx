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
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Hero Section with Images */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div
          className="relative overflow-hidden shadow-lg flex flex-col justify-center items-center rounded-2xl"
          style={{ background: '#0d316cff', minHeight: '7.5rem', height: '120px' }}
        >
        {/* No image in hero section as per request */}
        
        {/* Hall Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold" style={{ color: '#fff', letterSpacing: '1px' }}>{hall.name}</h1>
          <p className="text-sm mt-1" style={{ color: '#fff' }}>
            <span className="mr-1">📍</span>
            {hall.location}
          </p>
        </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Photos and Hall Info */}
          <div className="lg:col-span-3">
            {/* Hall Information and Action Buttons - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Hall Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#20056a' }}>Hall Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">👤</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#20056a' }}>Owner</p>
                      <p className="font-semibold" style={{ color: '#0d316cff' }}>{hall.owner_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">👥</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#20056a' }}>Capacity</p>
                      <p className="font-semibold" style={{ color: '#0d316cff' }}>{hall.capacity} Guests</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💰</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#20056a' }}>Price Per Day</p>
                      <p className="font-semibold text-2xl" style={{ color: '#0d316cff' }}>₹{hall.price_per_day.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📞</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#20056a' }}>Contact</p>
                      <p className="font-semibold" style={{ color: '#0d316cff' }}>{hall.contact_number}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--secondary)' }}>Take Action</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push(`/booking?hallId=${hallId}`)}
                    className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition shadow-lg"
                    style={{ background: '#20056a', color: '#fff' }}
                  >
                    📅 Book Now
                  </button>
                  
                  <button
                    onClick={() => router.push(`/customer/enquiry`)}
                    className="w-full py-2 px-4 rounded-lg font-semibold text-sm transition"
                    style={{ background: '#20056a', color: '#fff' }}
                  >
                    ✉️ Send Enquiry
                  </button>

                  <button
                    onClick={() => router.back()}
                    className="w-full py-2 px-4 rounded-lg font-medium text-sm transition"
                    style={{ background: '#20056a', color: '#fff' }}
                  >
                    ← Back to List
                  </button>
                  
                  {/* Call to Action Banner */}
                  <div className="mt-3" style={{ background: 'var(--navbar)', color: '#fff', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                    <p className="text-sm font-bold mb-0.5">🎉 Special Offer!</p>
                    <p className="text-xs" style={{ color: 'var(--info)' }}>Book now and get exclusive benefits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery and About This Hall - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Gallery */}
              {hall.photos && hall.photos.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: '#20056a' }}>Photo Gallery</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {hall.photos.map((photo: string, index: number) => (
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
              )}

              {/* About This Hall */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: '#20056a' }}>
                  <span className="text-3xl mr-2">🏛️</span>
                  About This Hall
                </h2>
                
                <p className="leading-relaxed text-sm" style={{ color: '#0d316cff' }}>
                  {hall.description || "Experience elegance and sophistication in our beautifully designed function hall. Whether you're planning a grand wedding, corporate event, or special celebration, our venue offers the perfect blend of style, comfort, and exceptional service."}
                </p>

                {/* Key Highlights */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center p-2" style={{ background: 'var(--light)', borderRadius: '0.5rem' }}>
                    <div className="text-2xl mb-1">✨</div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Premium Ambiance</p>
                  </div>
                  <div className="text-center p-2" style={{ background: 'var(--light)', borderRadius: '0.5rem' }}>
                    <div className="text-2xl mb-1">🎵</div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Sound & Lighting</p>
                  </div>
                  <div className="text-center p-2" style={{ background: 'var(--light)', borderRadius: '0.5rem' }}>
                    <div className="text-2xl mb-1">🍽️</div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Catering</p>
                  </div>
                  <div className="text-center p-2" style={{ background: 'var(--light)', borderRadius: '0.5rem' }}>
                    <div className="text-2xl mb-1">🅿️</div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Parking</p>
                  </div>
                </div>

                {/* Why Choose This Hall */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#20056a' }}>Why Choose This Hall?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center" style={{ color: 'var(--foreground)' }}>
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
            {packages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 overflow-hidden">
                <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: 'var(--secondary)' }}>
                  <span className="text-3xl mr-2">🎁</span>
                  Available Packages
                </h2>
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
                          const detailsDiv = e.currentTarget.querySelector('.package-details');
                          if (detailsDiv) {
                            (detailsDiv as HTMLElement).style.maxHeight = '500px';
                            (detailsDiv as HTMLElement).style.opacity = '1';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const marquee = document.getElementById('packageMarquee');
                          marquee?.classList.remove('marquee-paused');
                          const detailsDiv = e.currentTarget.querySelector('.package-details');
                          if (detailsDiv) {
                            (detailsDiv as HTMLElement).style.maxHeight = '0';
                            (detailsDiv as HTMLElement).style.opacity = '0';
                          }
                        }}
                      >
                        <h3 className="font-bold text-lg" style={{ color: 'var(--primary)' }}>{pkg.package_name}</h3>
                        <div className="text-2xl font-bold mt-2" style={{ color: 'var(--primary)' }}>₹{pkg.price?.toLocaleString()}</div>
                        <div 
                          className="package-details text-gray-600 text-xs whitespace-pre-line leading-relaxed mt-2 overflow-hidden transition-all duration-500"
                          style={{ maxHeight: '0', opacity: '0' }}
                        >
                          {pkg.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
    </div>
  );
}
