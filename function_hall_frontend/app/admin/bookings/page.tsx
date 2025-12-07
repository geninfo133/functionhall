"use client";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../lib/config";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => {
        // Fetch additional details for each booking
        const promises = data.map(async (booking: any) => {
          const [hallRes, customerRes] = await Promise.all([
            fetch(`${BACKEND_URL}/api/halls/${booking.hall_id}`),
            fetch(`${BACKEND_URL}/api/customers`)
          ]);
          const hall = await hallRes.json();
          const customers = await customerRes.json();
          const customer = customers.find((c: any) => c.id === booking.customer_id);
          
          return {
            ...booking,
            hall_name: hall.name,
            hall_location: hall.location,
            customer_name: customer?.name || 'Unknown',
            customer_email: customer?.email || ''
          };
        });
        
        Promise.all(promises).then(enrichedBookings => {
          setBookings(enrichedBookings);
          setLoading(false);
        });
      });
  };

  const updateStatus = async (bookingId: number, newStatus: string) => {
    setUpdating(bookingId);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchBookings(); // Refresh the list
      }
    } catch (err) {
      console.error('Failed to update booking');
    }
    setUpdating(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="p-8 w-full">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">Manage Bookings</h1>
          
          {loading ? (
            <div className="text-center py-12">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600">No bookings found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hall</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">#{booking.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">{booking.customer_name}</div>
                        <div className="text-xs text-gray-500">{booking.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">{booking.hall_name}</div>
                        <div className="text-xs text-gray-500">{booking.hall_location}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(booking.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                        ₹{booking.total_amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {booking.status === 'Pending' && (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => updateStatus(booking.id, 'Confirmed')}
                              disabled={updating === booking.id}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
                            >
                              {updating === booking.id ? 'Updating...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => updateStatus(booking.id, 'Cancelled')}
                              disabled={updating === booking.id}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'Cancelled')}
                            disabled={updating === booking.id}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === 'Cancelled' && (
                          <span className="text-sm text-gray-500">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
    </div>
  );
}
