import { Hall } from "../types/hall";

interface Props {
  hall: Hall;
}

export default function HallCard({ hall }: Props) {
  return (
    <div className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={hall.image_url}
        alt={hall.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{hall.name}</h2>
        <p className="text-gray-600 mb-1">{hall.location}</p>
        <p className="text-gray-800 mb-1">
          Capacity: {hall.capacity} guests
        </p>
        <p className="text-orange-600 font-semibold mb-3">
          ₹{hall.price_per_day.toLocaleString()} per day
        </p>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
          View Details
        </button>
      </div>
    </div>
  );
}
