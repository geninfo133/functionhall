// components/HallCards.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaUsers, FaStar, FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";
import { BACKEND_URL } from "../lib/config";

type HallCardsProps = {
  halls?: any[];
  loading?: boolean;
  onEdit?: (hall: any) => void;
  onDelete?: (hall: any) => void;
};

export default function HallCards({ halls: propHalls, loading: propLoading, onEdit, onDelete }: HallCardsProps) {
  const [halls, setHalls] = useState<any[]>(propHalls || []);
  const [loading, setLoading] = useState<boolean>(propLoading ?? true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (typeof propHalls === 'undefined') {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/halls`)
        .then(res => res.json())
        .then(data => {
          setHalls(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setHalls(propHalls);
      setLoading(!!propLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propHalls, propLoading]);

  const toggleFavorite = (hallId: number) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(hallId)) {
        newFavs.delete(hallId);
      } else {
        newFavs.add(hallId);
      }
      return newFavs;
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
        </div>
      ) : halls.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-gray-100">
          <p className="text-xl text-gray-600">No venues found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {halls.map((hall: any) => (
            <div
              key={hall.id}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                {hall.photos && hall.photos.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hall.photos[0]}
                    alt={hall.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Silently handle missing images - show fallback
                      // Try next photo if available
                      if (hall.photos.length > 1 && !e.currentTarget.dataset.fallbackTried) {
                        e.currentTarget.dataset.fallbackTried = "true";
                        e.currentTarget.src = hall.photos[1];
                      } else {
                        // Hide image and show fallback
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-content');
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }
                      }
                    }}
                  />
                ) : null}
                {/* Fallback content */}
                <div className="fallback-content flex items-center justify-center h-full" style={{ display: hall.photos && hall.photos.length > 0 ? 'none' : 'flex' }}>
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">{hall.name}</div>
                    <div className="text-gray-300 text-sm mt-2">No image available</div>
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Favorite Heart Icon */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(hall.id);
                  }}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                >
                  {favorites.has(hall.id) ? (
                    <FaHeart className="text-red-500 text-base" />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-base" />
                  )}
                </button>

                {/* Price Badge */}
                <div className="absolute top-3 left-3 bg-[#20056a] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  ₹{hall.price_per_day.toLocaleString()}/day
                </div>

                {/* Info Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href={`/halls/${hall.id}`}
                    className="bg-white text-[#20056a] px-6 py-3 rounded-lg font-semibold shadow-xl hover:bg-blue-50 transition transform scale-90 group-hover:scale-100"
                  >
                    Quick View
                  </Link>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Title and Location */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{hall.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaMapMarkerAlt className="mr-1.5 text-[#20056a]" />
                    <span className="line-clamp-1">{hall.location}</span>
                  </div>
                </div>

                {/* Rating and Capacity */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${i < (hall.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({hall.rating || 4}.0)</span>
                  </div>
                  <div className="flex items-center text-gray-700 text-sm font-semibold">
                    <FaUsers className="mr-1.5 text-[#20056a]" />
                    {hall.capacity}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                  {hall.description || 'Beautiful venue perfect for weddings, corporate events, and celebrations.'}
                </p>

                {/* Tags */}
                {hall.tags && hall.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hall.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-[#20056a] px-3 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Packages */}
                {hall.packages && hall.packages.length > 0 && (
                  <div className="mb-4 border-t border-gray-100 pt-3">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Available Packages:</h4>
                    <div className="space-y-2">
                      {hall.packages.slice(0, 2).map((pkg: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-[#20056a]">{pkg.package_name}</span>
                          </div>
                          {pkg.details && (
                            <p className="text-xs text-gray-600 line-clamp-2">{pkg.details}</p>
                          )}
                        </div>
                      ))}
                      {hall.packages.length > 2 && (
                        <p className="text-xs text-gray-500 italic">+{hall.packages.length - 2} more packages</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-3">
                  {onEdit && onDelete ? (
                    // Admin buttons
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(hall);
                        }}
                        className="flex-1 text-center border-2 border-blue-600 text-[#20056a] py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                      >
                        <FaEdit className="text-sm" /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(hall);
                        }}
                        className="flex-1 text-center bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2"
                      >
                        <FaTrash className="text-sm" /> Delete
                      </button>
                    </>
                  ) : (
                    // Customer buttons
                    <>
                      <Link
                        href={`/halls/${hall.id}`}
                        className="flex-1 text-center border-2 border-blue-600 text-[#20056a] py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/booking?hallId=${hall.id}`}
                        className="flex-1 text-center bg-[#20056a] text-white py-2.5 rounded-lg font-semibold hover:bg-[#150442] transition shadow-md"
                      >
                        Book Now
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
