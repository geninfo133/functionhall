"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "../../../lib/config";
import HallCalendar from "../../../components/HallCalendar";
import { FaBuilding, FaMapMarkerAlt, FaUsers, FaUser, FaEnvelope, FaCalendarAlt, FaBox, FaRupeeSign, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlHallId = searchParams.get("hallId");
  const [customer, setCustomer] = useState<any>(null);
  const [halls, setHalls] = useState<any[]>([]);
  const [selectedHallId, setSelectedHallId] = useState(urlHallId || "");
  const [hall, setHall] = useState<any>(null);
  const [eventDate, setEventDate] = useState("");
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availability, setAvailability] = useState<{available: boolean, message: string} | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [hallBookings, setHallBookings] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  useEffect(() => {
    console.log('🌐 BACKEND_URL:', BACKEND_URL);
    // Check if customer is logged in
    const customerInfo = localStorage.getItem("customerInfo");
    if (!customerInfo) {
      // Redirect to phone verification for new customers
      router.push("/customer/phone-verify");
      return;
    }
    const parsedCustomer = JSON.parse(customerInfo);
    // Allow customers with or without is_phone_verified field
    // Only block if explicitly set to false (new registration flow)
    if (parsedCustomer.is_phone_verified === false) {
      // Phone not verified, redirect to phone verification
      localStorage.removeItem("customerInfo");
      localStorage.removeItem("customerToken");
      router.push("/customer/phone-verify");
      return;
    }
    setCustomer(parsedCustomer);
    // Load all halls
    fetch(`${BACKEND_URL}/api/halls`)
      .then(res => res.json())
      .then(data => setHalls(data));
  }, [router]);

  // Load hall details when selected
  useEffect(() => {
    if (selectedHallId) {
      fetch(`${BACKEND_URL}/api/halls/${selectedHallId}`)
        .then(res => res.json())
        .then(data => setHall(data));
      // Load packages for this hall
      setLoadingPackages(true);
      const packagesUrl = `${BACKEND_URL}/api/halls/${selectedHallId}/packages`;
      console.log('🔗 Fetching packages from:', packagesUrl);
      fetch(packagesUrl)
        .then(res => {
          console.log('📦 Packages response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('📦 Packages loaded:', data);
          setPackages(data);
        })
        .catch(err => {
          console.error('❌ Failed to load packages:', err);
          console.error('❌ URL attempted:', packagesUrl);
          setPackages([]);
        })
        .finally(() => setLoadingPackages(false));
      // Load bookings for this hall
      fetch(`${BACKEND_URL}/api/bookings?hall_id=${selectedHallId}`)
        .then(res => res.json())
        .then(data => setHallBookings(data))
        .catch(err => console.error("Failed to fetch bookings", err));
    }
  }, [selectedHallId]);

  // Check availability when date changes
  useEffect(() => {
    if (eventDate && selectedHallId) {
      checkAvailability();
    }
  }, [eventDate, selectedHallId]);

  const checkAvailability = async () => {
    if (!eventDate || !selectedHallId) return;
    setCheckingAvailability(true);
    setAvailability(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/halls/${selectedHallId}/availability?date=${eventDate}`);
      const data = await res.json();
      setAvailability(data);
    } catch (err) {
      console.error("Failed to check availability");
    }
    setCheckingAvailability(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!customer || !eventDate || !selectedHallId) {
      setError("Please fill all required fields");
      return;
    }
    if (availability && !availability.available) {
      setError("This date is not available. Please select another date.");
      return;
    }
    const totalAmount = selectedPackage ? selectedPackage.price : hall?.price_per_day || 0;
    const advanceAmount = Math.round(totalAmount / 4);
    // Show confirmation dialog with advance payment details
    const confirmMessage = `Total Amount: ₹${totalAmount}\n\nTo confirm your booking, you need to pay an advance of ₹${advanceAmount} (25% of total amount).\n\nYou will receive payment details via SMS on your registered mobile number.\n\nDo you want to proceed?`;
    if (!confirm(confirmMessage)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer.id,
          hall_id: parseInt(selectedHallId),
          event_date: eventDate,
          status: "Pending",
          total_amount: totalAmount,
          advance_amount: advanceAmount
        })
      });
      if (res.ok) {
        setSuccess(`Booking submitted successfully! Please pay advance amount of ₹${advanceAmount}. Payment details have been sent to your mobile number.`);
        setTimeout(() => router.push("/my-bookings"), 3000);
      } else {
        setError("Failed to create booking. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <main className="p-8 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-3xl text-[#20056a]" />
            </div>
            <h1 className="text-3xl font-bold text-[#20056a] mb-2">Book a Function Hall</h1>
            <p className="text-gray-600">Select your hall and date to book</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Booking Form */}
          <div>
            {hall && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FaBuilding className="text-[#20056a] text-2xl" />
                  <h2 className="text-2xl font-bold text-[#20056a]">{hall.name}</h2>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center space-x-2 text-gray-600">
                    <FaMapMarkerAlt className="text-[#20056a]" />
                    <span><span className="font-semibold">Location:</span> {hall.location}</span>
                  </p>
                  <p className="flex items-center space-x-2 text-gray-600">
                    <FaUsers className="text-[#20056a]" />
                    <span><span className="font-semibold">Capacity:</span> {hall.capacity} guests</span>
                  </p>
                  <p className="flex items-center space-x-2 text-gray-600">
                    <FaUser className="text-[#20056a]" />
                    <span><span className="font-semibold">Owner:</span> {hall.owner_name}</span>
                  </p>
                  <p className="flex items-center space-x-2 text-[#20056a] font-bold text-xl mt-2">
                    <FaRupeeSign />
                    <span>{hall.price_per_day}/day</span>
                  </p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">              Select Hall *
            </label>
            <select
              value={selectedHallId}
              onChange={(e) => setSelectedHallId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a Hall --</option>
              {halls.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} - {h.location} (Capacity: {h.capacity})
                </option>
              ))}
            </select>
            {hall && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm"><strong>Owner:</strong> {hall.owner_name}</p>
                <p className="text-sm"><strong>Price:</strong> ₹{hall.price_per_day}/day</p>
              </div>
            )}
          </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="text-[#20056a]" />
                  <span>Customer Name</span>
                </label>
                <input
                  type="text"
                  value={customer.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="text-[#20056a]" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={customer.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              {eventDate && (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="text-[#20056a]" />
                    <span>Selected Event Date</span>
                  </label>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="flex items-center space-x-2 text-sm font-semibold text-blue-800">
                      <FaCalendarAlt />
                      <span>{new Date(eventDate).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </p>
                  </div>
                  {checkingAvailability && (
                    <p className="text-sm text-gray-500 mt-2">Checking availability...</p>
                  )}
                  {availability && (
                    <div className={`flex items-center space-x-2 mt-2 p-3 rounded-lg ${availability.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {availability.available ? <FaCheckCircle /> : <FaTimesCircle />}
                      {availability.available ? '✓ ' : '✗ '}{availability.message}
                    </div>
                  )}
                </div>
              )}
          {loadingPackages ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading packages...</p>
            </div>
          ) : packages.length > 0 ? (
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <FaBox className="text-[#20056a]" />
                <span>Select Package (Optional)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition hover:shadow-lg ${
                      selectedPackage?.id === pkg.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{pkg.package_name}</h3>
                      {selectedPackage?.id === pkg.id && (
                        <FaCheckCircle className="text-[#20056a] text-xl" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-2 mb-3">{pkg.details}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-500 text-xs font-medium">Package Price</span>
                      <span className="text-[#20056a] font-bold text-lg">₹{pkg.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              {selectedPackage && (
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Selected Package</p>
                      <p className="font-bold text-lg text-green-800">{selectedPackage.package_name}</p>
                    </div>
                    <p className="text-green-600 font-bold text-xl">₹{selectedPackage.price.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          ) : selectedHallId ? (
            <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <FaBox className="text-gray-400 text-4xl mx-auto mb-2" />
              <p className="text-gray-600 font-medium">No packages available for this hall</p>
              <p className="text-gray-500 text-sm mt-1">You can book the hall at base price</p>
            </div>
          ) : null}
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 bg-green-50 p-3 rounded-lg">
              {success}
            </div>
          )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#20056a] text-white py-3 rounded-lg font-semibold hover:bg-[#150442] transition disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </form>
          </div>
          {/* Right Column - Calendar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-[#20056a] mb-4">Select Event Date</h2>
              {selectedHallId ? (
                <HallCalendar
                  hallId={parseInt(selectedHallId)}
                  selectedDate={eventDate}
                  onDateSelect={(date) => setEventDate(date)}
                  bookings={hallBookings}
                />
              ) : (
                <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500">Please select a hall first to view available dates</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

export default function BookingPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}
