"use client";

import { useState, useEffect } from "react";

interface Booking {
  id: number;
  event_date: string;
  status: string;
}

interface HallCalendarProps {
  hallId: number;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  bookings: Booking[];
}

export default function HallCalendar({ hallId, selectedDate, onDateSelect, bookings }: HallCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    generateCalendar();
  }, [currentMonth, bookings]);

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek;

    // Generate 42 days (6 weeks)
    const days: Date[] = [];

    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    setCalendarDays(days);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateStatus = (date: Date): { color: string; status: string; clickable: boolean } => {
    const dateStr = formatDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    // Check if date is in the past
    if (compareDate < today) {
      return { color: "bg-gray-500 text-white cursor-not-allowed", status: "Past", clickable: false };
    }

    // Check if date is not in current month
    if (date.getMonth() !== currentMonth.getMonth()) {
      return { color: "bg-gray-400 text-gray-200 cursor-not-allowed", status: "Other Month", clickable: false };
    }

    // Check bookings
    const booking = bookings.find(b => b.event_date === dateStr);
    
    if (booking) {
      if (booking.status === 'Confirmed') {
        return { color: "bg-red-600 text-white cursor-not-allowed", status: "Booked", clickable: false };
      } else if (booking.status === 'Pending') {
        return { color: "bg-yellow-500 text-white cursor-not-allowed", status: "Reserved", clickable: false };
      }
    }

    // Available
    return { color: "bg-green-600 text-white hover:bg-green-700 cursor-pointer", status: "Available", clickable: true };
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date);
    if (status.clickable) {
      onDateSelect(formatDate(date));
    }
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate === formatDate(date);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-bold text-orange-600">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Next →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-semibold text-gray-700 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          const status = getDateStatus(date);
          const selected = isSelected(date);
          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                p-4 text-center rounded-lg border-2 transition
                ${status.color}
                ${selected ? 'border-orange-500 ring-2 ring-orange-300' : 'border-transparent'}
              `}
            >
              <div className="font-semibold">{date.getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Legend:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 border border-green-700 rounded shadow-sm"></div>
            <span className="text-sm font-medium text-gray-900">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 border border-yellow-600 rounded shadow-sm"></div>
            <span className="text-sm font-medium text-gray-900">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 border border-red-700 rounded shadow-sm"></div>
            <span className="text-sm font-medium text-gray-900">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 border border-gray-600 rounded shadow-sm"></div>
            <span className="text-sm font-medium text-gray-900">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
