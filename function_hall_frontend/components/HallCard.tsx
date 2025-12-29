import { Hall } from "../types/hall";

interface Props {
  hall: Hall;
}

export default function HallCard({ hall }: Props) {
  // Get the first photo or use a placeholder
  const imageUrl = hall.photos && hall.photos.length > 0 
    ? hall.photos[0] 
    : hall.image_url || 'https://images.unsplash.com/photo-1519167758481-83f29da8170d?w=800';
    
  return (
    <div className="border border-slate-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition bg-slate-800">
      <img
        src={imageUrl}
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
        <button className="bg-[#20056a] text-white px-4 py-2 rounded-md hover:bg-[#150442] transition">
          View Details
        </button>
      </div>
    </div>
  );
}
