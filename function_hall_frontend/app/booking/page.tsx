"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "../../lib/config";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hallId = searchParams.get("hallId");
  
  const [customer, setCustomer] = useState<any>(null);
  const [hall, setHall] = useState<any>(null);
  const [eventDate, setEventDate] = useState("");
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availability, setAvailability] = useState<{available: boolean, message: string} | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    // Check if customer is logged in
    const customerInfo = localStorage.getItem("customerInfo");
    if (!customerInfo) {
      router.push("/customer/login");
      return;
    }
    setCustomer(JSON.parse(customerInfo));

    // Load hall details if hallId is provided
    if (hallId) {
      fetch(`${BACKEND_URL}/api/halls/${hallId}`)
        .then(res => res.json())
        .then(data => setHall(data));
      
      // Load packages for this hall
      fetch(`${BACKEND_URL}/api/halls/${hallId}/packages`)
        .then(res => res.json())
        .then(data => setPackages(data));
    }
  }, [hallId, router]);

  // Check availability when date changes
  useEffect(() => {
    if (eventDate && hallId) {
      checkAvailability();
    }
  }, [eventDate, hallId]);

  const checkAvailability = async () => {
    if (!eventDate || !hallId) return;
    
    setCheckingAvailability(true);
    setAvailability(null);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/halls/${hallId}/availability?date=${eventDate}`);
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

    if (!customer || !eventDate) {
      setError("Please fill all required fields");
      return;
    }

    if (!hallId) {
      setError("Please select a hall first");
      return;
    }

    if (availability && !availability.available) {
      setError("This date is not available. Please select another date.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer.id,
          hall_id: parseInt(hallId),
          event_date: eventDate,
          status: "Pending",
          total_amount: selectedPackage ? selectedPackage.price : hall?.price_per_day || 0
        })
      });

      if (res.ok) {
        setSuccess("Booking submitted successfully! You will receive confirmation soon.");
        setTimeout(() => router.push("/my-bookings"), 2000);
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
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Book a Function Hall</h1>
        
        {hall && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{hall.name}</h2>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Location:</span> {hall.location}</p>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Capacity:</span> {hall.capacity} guests</p>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Owner:</span> {hall.owner_name}</p>
            <p className="text-orange-600 font-bold text-xl mt-2">₹{hall.price_per_day}/day</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customer.name}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={customer.email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
            {checkingAvailability && (
              <p className="text-sm text-gray-500 mt-1">Checking availability...</p>
            )}
            {availability && (
              <div className={`mt-2 p-3 rounded-lg ${availability.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {availability.available ? '✓ ' : '✗ '}{availability.message}
              </div>
            )}
          </div>

          {packages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Package (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      selectedPackage?.id === pkg.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
                    <p className="text-orange-600 font-bold mt-2">₹{pkg.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>

        {!hallId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-yellow-800">
              Please select a hall from the <a href="/home" className="text-orange-600 font-semibold underline">home page</a> first.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
