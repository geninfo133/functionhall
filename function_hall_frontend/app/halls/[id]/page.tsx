"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";

import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";

export default function HallDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hall, setHall] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    event_date: "",
    guests: "",
    package_id: "",
    notes: ""
  });
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    fetch(`${BACKEND_URL}/api/check-auth`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data);
        }
      });

    // Fetch hall details
    fetch(`${BACKEND_URL}/api/halls/${id}`)
      .then(res => res.json())
      .then(data => {
        setHall(data);
        setLoading(false);
      });
    
    // Fetch packages
    fetch(`${BACKEND_URL}/api/halls/${id}/packages`)
      .then(res => res.json())
      .then(data => setPackages(data));
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      // Not logged in, redirect to login
      router.push(`/auth/login?redirect=/halls/${id}`);
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    if (!bookingData.event_date) {
      setBookingError("Please select an event date");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          hall_id: id,
          event_date: bookingData.event_date,
          package_id: bookingData.package_id || null,
          notes: bookingData.notes
        })
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setShowBookingModal(false);
          router.push("/my-bookings");
        }, 2000);
      } else {
        setBookingError(data.error || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError("Failed to create booking. Please try again.");
    }
  };

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
              <h1 className="text-4xl font-bold text-orange-700 mb-4">{hall.name}</h1>
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
                  <span className="text-orange-700 font-bold">₹{hall.price_per_day}</span>
              </div>
              <p className="text-gray-700 mb-4">{hall.description}</p>
            </div>

            {/* Packages */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-orange-700 mb-2">Packages</h2>
              {packages.length === 0 ? (
                <p className="text-gray-500">No packages available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg: any) => (
                    <div key={pkg.id} className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-bold text-orange-700 mb-1">{pkg.package_name}</h3>
                      <p className="text-gray-700 mb-1">₹{pkg.price}</p>
                      <p className="text-gray-500 text-sm">{pkg.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Partners, Services, Dates - Placeholders */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-orange-700 mb-2">Partners & Services</h2>
              <p className="text-gray-500">Coming soon: partners, services, and available dates.</p>
            </div>

            {/* Book Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleBookNow}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-orange-700 transition"
              >
                {user ? "Book Now" : "Login to Book"}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-orange-600 mb-6">Book {hall.name}</h2>
            
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Successful!</h3>
                <p className="text-gray-600">Redirecting to your bookings...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {bookingError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {bookingError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.event_date}
                    onChange={(e) => setBookingData({...bookingData, event_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Guests (Optional)
                  </label>
                  <input
                    type="number"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                    placeholder="e.g., 200"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {packages.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Package (Optional)
                    </label>
                    <select
                      value={bookingData.package_id}
                      onChange={(e) => setBookingData({...bookingData, package_id: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">No package</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.package_name} - ₹{pkg.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    placeholder="Any special requirements..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Hall Price:</span>
                    <span className="font-bold text-orange-600">₹{hall.price_per_day}</span>
                  </div>
                  {bookingData.package_id && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Package:</span>
                      <span className="font-bold text-orange-600">
                        ₹{packages.find(p => p.id === parseInt(bookingData.package_id))?.price || 0}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-orange-300 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-gray-800">Total:</span>
                    <span className="font-bold text-orange-600 text-xl">
                      ₹{hall.price_per_day + (bookingData.package_id ? (packages.find(p => p.id === parseInt(bookingData.package_id))?.price || 0) : 0)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
