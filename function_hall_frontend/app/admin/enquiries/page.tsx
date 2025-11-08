"use client";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../lib/config";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/enquiries`)
      .then(res => res.json())
      .then(data => {
        setEnquiries(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-500 mb-6">Customer Enquiries</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow border">
          <thead>
            <tr className="bg-orange-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enq: any) => (
              <tr key={enq.id} className="border-t">
                <td className="px-4 py-2">{enq.customer_name}</td>
                <td className="px-4 py-2">{enq.email}</td>
                <td className="px-4 py-2">{enq.message}</td>
                <td className="px-4 py-2">{enq.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
