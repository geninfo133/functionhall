// app/dashboard/halls/[id]/page.tsx
import { getHalls } from "@/lib/data";

export default function HallDetails({ params }: { params: { id: string } }) {
  const hall = getHalls().find((h) => h.id === Number(params.id));
  if (!hall) return <div>Hall not found</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">{hall.name}</h1>
      <p><strong>Location:</strong> {hall.location}</p>
      <p><strong>Capacity:</strong> {hall.capacity}</p>
      <p><strong>Price:</strong> ₹{hall.price}</p>
    </div>
  );
}
