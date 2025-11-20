"use client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../lib/config";
import MainNavbar from "../../components/MainNavbar";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/my-bookings`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return res.json();
      })
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <MainNavbar />
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-orange-600">My Bookings</h1>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No bookings found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {bookings.map(booking => (
              <div key={booking.id} className="border rounded-xl shadow-md p-4 bg-white">
                <h2 className="text-xl font-bold mb-2 text-orange-600">{booking.hall_name}</h2>
                <p className="text-gray-700 mb-1">Event Date: {booking.event_date}</p>
                <p className="text-gray-700 mb-1">Status: {booking.status}</p>
                <p className="text-gray-800 font-semibold">₹{booking.total_amount?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
