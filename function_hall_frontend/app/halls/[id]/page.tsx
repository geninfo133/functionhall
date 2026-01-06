"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import Image from "next/image";
import HallCalendar from "../../../components/HallCalendar";

export default function HallDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hallId = params.id;
  
  const [hall, setHall] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [functionalRooms, setFunctionalRooms] = useState<any[]>([]);
  const [guestRooms, setGuestRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [hallBookings, setHallBookings] = useState<any[]>([]);

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
      
      // Fetch functional and guest rooms
      fetch(`${BACKEND_URL}/api/halls/${hallId}/rooms`, {
        cache: 'no-store'
      })
        .then(res => res.ok ? res.json() : { functional_rooms: [], guest_rooms: [] })
        .then(data => {
          setFunctionalRooms(data.functional_rooms || []);
          setGuestRooms(data.guest_rooms || []);
        })
        .catch(() => {
          setFunctionalRooms([]);
          setGuestRooms([]);
        });
      
      // Fetch bookings for calendar
      fetch(`${BACKEND_URL}/api/bookings?hall_id=${hallId}`, {
        cache: 'no-store'
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => setHallBookings(data))
        .catch(() => setHallBookings([]));
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
                      <p className="text-xs text-amber-600 mt-1">⚡ Electricity charges extra (as per usage)</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <p className="text-xs font-semibold text-[#20056a] mb-2">✅ Included in Hall Price:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Chairs for {hall.capacity} guests</li>
                      {hall.has_basic_rooms && (
                        <li>• {hall.basic_rooms_count || 2} Basic preparation room{(hall.basic_rooms_count || 2) > 1 ? 's' : ''}</li>
                      )}
                      {hall.has_stage && (
                        <li>• Stage/Platform</li>
                      )}
                      {hall.has_dining_hall && (
                        <li>• Dining Hall</li>
                      )}
                      {hall.has_kitchen && (
                        <li>• Kitchen with utensils</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-start mt-4">
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

            {/* Contact & Location Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#20056a] mb-4 flex items-center">
                <span className="text-3xl mr-2">📍</span>
                Contact & Location
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google Map */}
                <div>
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(hall.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Hall Location Map"
                    ></iframe>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Address</p>
                      <p className="text-sm text-gray-700">{hall.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📞</span>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Contact Number</p>
                      <a 
                        href={`tel:${hall.contact_number}`}
                        className="text-sm text-[#20056a] font-semibold hover:underline"
                      >
                        {hall.contact_number}
                      </a>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-2">Follow Us</p>
                    <div className="flex gap-3">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        <span className="text-xl">📺</span>
                        YouTube
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        <span className="text-xl">📸</span>
                        Instagram
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hall.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#20056a] hover:bg-[#150442] text-white text-center py-3 px-4 rounded-lg font-semibold text-sm transition shadow-lg"
                    >
                      🗺️ Open Google Maps
                    </a>
                    <button
                      onClick={() => router.push(`/customer/enquiry`)}
                      className="bg-[#20056a] text-white py-3 px-4 rounded-lg font-semibold text-sm hover:bg-[#150442] transition shadow-lg"
                    >
                      ✉️ Send Enquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Calendar - Collapsible */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <h2 className="text-2xl font-bold text-[#20056a] flex items-center">
                  <span className="text-3xl mr-2">📅</span>
                  Check Availability Calendar
                </h2>
                <button className="text-3xl text-[#20056a] group-hover:scale-110 transition-transform">
                  {showCalendar ? '▲' : '▼'}
                </button>
              </div>
              
              {showCalendar && (
                <div className="mt-6 animate-fadeIn">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Note:</span> View available, booked, and reserved dates below. 
                      Select your preferred date when booking.
                    </p>
                    <div className="flex gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                        <span>Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                        <span>Reserved</span>
                      </div>
                    </div>
                  </div>
                  <HallCalendar
                    hallId={parseInt(hallId as string)}
                    selectedDate={null}
                    onDateSelect={() => {}}
                    bookings={hallBookings}
                  />
                </div>
              )}
            </div>

            {/* Room Facilities Section */}
            {(functionalRooms.length > 0 || guestRooms.length > 0) && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-[#20056a] mb-4">Room Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Functional Rooms */}
                  {functionalRooms.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🚪</span>
                        Functional Rooms
                      </h3>
                      <div className="space-y-3">
                        {functionalRooms.map((room, idx) => (
                          <div key={idx} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                            <h4 className="font-bold text-gray-800">{room.room_type}</h4>
                            {room.capacity > 0 && (
                              <p className="text-sm text-gray-600 mt-1">Capacity: {room.capacity} people</p>
                            )}
                            {room.amenities && (
                              <p className="text-sm text-gray-600 mt-1">Amenities: {room.amenities}</p>
                            )}
                            {room.description && (
                              <p className="text-xs text-gray-500 mt-2">{room.description}</p>
                            )}
                            <div className="mt-3 pt-3 border-t border-purple-300">
                              <span className="text-purple-700 font-bold text-lg">₹{room.price.toLocaleString()}</span>
                              <span className="text-xs text-gray-600 ml-2">per booking</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Guest Rooms */}
                  {guestRooms.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🛏️</span>
                        Guest Accommodation
                      </h3>
                      <div className="space-y-3">
                        {guestRooms.map((room, idx) => (
                          <div key={idx} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-800">{room.room_category}</h4>
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                {room.total_rooms} room{room.total_rooms > 1 ? 's' : ''}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{room.bed_type} • Max {room.max_occupancy} persons</p>
                            {room.amenities && (
                              <p className="text-sm text-gray-600 mt-1">Amenities: {room.amenities}</p>
                            )}
                            {room.description && (
                              <p className="text-xs text-gray-500 mt-2">{room.description}</p>
                            )}
                            <div className="mt-3 pt-3 border-t border-blue-300">
                              <span className="text-blue-700 font-bold text-lg">₹{room.price_per_room.toLocaleString()}</span>
                              <span className="text-xs text-gray-600 ml-2">per room/night</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    {[...packages, ...packages].map((pkg, index) => {
                      const colors = [
                        { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-300', hover: 'hover:border-blue-500', text: 'text-blue-800', titleBg: 'bg-blue-200' },
                        { bg: 'bg-gradient-to-br from-purple-50 to-purple-100', border: 'border-purple-300', hover: 'hover:border-purple-500', text: 'text-purple-800', titleBg: 'bg-purple-200' },
                        { bg: 'bg-gradient-to-br from-green-50 to-green-100', border: 'border-green-300', hover: 'hover:border-green-500', text: 'text-green-800', titleBg: 'bg-green-200' },
                        { bg: 'bg-gradient-to-br from-orange-50 to-orange-100', border: 'border-orange-300', hover: 'hover:border-orange-500', text: 'text-orange-800', titleBg: 'bg-orange-200' },
                        { bg: 'bg-gradient-to-br from-pink-50 to-pink-100', border: 'border-pink-300', hover: 'hover:border-pink-500', text: 'text-pink-800', titleBg: 'bg-pink-200' },
                        { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', border: 'border-indigo-300', hover: 'hover:border-indigo-500', text: 'text-indigo-800', titleBg: 'bg-indigo-200' },
                      ];
                      const colorScheme = colors[index % colors.length];
                      
                      return (
                        <div
                          key={`${pkg.id}-${index}`}
                          className={`border-2 ${colorScheme.border} ${colorScheme.bg} rounded-lg p-4 cursor-pointer transition-all duration-300 ${colorScheme.hover} hover:shadow-xl hover:scale-105`}
                          onMouseEnter={(e) => {
                            const marquee = document.getElementById('packageMarquee');
                            marquee?.classList.add('marquee-paused');
                          }}
                          onMouseLeave={(e) => {
                            const marquee = document.getElementById('packageMarquee');
                            marquee?.classList.remove('marquee-paused');
                          }}
                        >
                          <div className={`inline-block ${colorScheme.titleBg} px-3 py-1 rounded-full mb-2`}>
                            <h3 className={`font-bold text-base ${colorScheme.text}`}>{pkg.package_name}</h3>
                          </div>
                          <div className="mt-2 mb-3">
                            <span className={`font-bold text-2xl ${colorScheme.text}`}>₹{pkg.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-600 ml-2">per event</span>
                          </div>
                          {pkg.details && (
                            <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed mt-3 pt-3 border-t border-gray-300">
                              {pkg.details}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
