import { Hall } from "../types/hall";

interface Props {
  hall: Hall;
}

export default function HallCard({ hall }: Props) {
  return (
    <div className="border border-slate-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition bg-slate-800">
      <img
        src={hall.image_url}
        alt={hall.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-white">{hall.name}</h2>
        <p className="text-slate-400 mb-1">{hall.location}</p>
        <p className="text-slate-300 mb-1">
          Capacity: {hall.capacity} guests
        </p>
        <p className="text-slate-300 font-semibold mb-3">
          ₹{hall.price_per_day.toLocaleString()} per day
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          View Details
        </button>
      </div>
    </div>
  );
}
