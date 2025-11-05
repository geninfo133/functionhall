"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white py-6 px-8 shadow">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        <nav className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/halls" className="block bg-white rounded-xl shadow p-6 hover:bg-blue-50 border border-gray-200">
            <span className="text-xl font-semibold text-blue-900">Manage Halls</span>
            <p className="text-gray-600 mt-2">Add, edit, or delete function halls.</p>
          </Link>
          <Link href="/admin/packages" className="block bg-white rounded-xl shadow p-6 hover:bg-blue-50 border border-gray-200">
            <span className="text-xl font-semibold text-blue-900">Manage Packages</span>
            <p className="text-gray-600 mt-2">Edit packages for each hall.</p>
          </Link>
          <Link href="/admin/bookings" className="block bg-white rounded-xl shadow p-6 hover:bg-blue-50 border border-gray-200">
            <span className="text-xl font-semibold text-blue-900">Manage Bookings</span>
            <p className="text-gray-600 mt-2">View and update all bookings.</p>
          </Link>
          <Link href="/admin/customers" className="block bg-white rounded-xl shadow p-6 hover:bg-blue-50 border border-gray-200">
            <span className="text-xl font-semibold text-blue-900">Manage Customers</span>
            <p className="text-gray-600 mt-2">View and manage customer details.</p>
          </Link>
        </nav>
        <section className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Welcome, Admin!</h2>
          <p className="text-gray-700">Use the links above to manage halls, packages, bookings, and customers. More features coming soon!</p>
        </section>
      </main>
    </div>
  );
}
