"use client";
import { useState, useEffect } from "react";

interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  status: "available" | "booked" | "reserved" | "past";
}

interface CalendarProps {
  hallId: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  bookings?: any[];
}

export default function HallCalendar({ hallId, selectedDate, onDateSelect, bookings = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    generateCalendar();
  }, [currentMonth, bookings]);

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Previous month days to show
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        dateString: formatDate(date),
        isCurrentMonth: false,
        status: "past"
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDate(date);
      
      let status: CalendarDay["status"] = "available";
      
      // Check if date is in the past
      if (date < today) {
        status = "past";
      } else {
        // Check booking status
        const booking = bookings.find(b => b.event_date === dateString);
        if (booking) {
          status = booking.status === "Confirmed" ? "booked" : "reserved";
        }
      }
      
      days.push({
        date,
        dateString,
        isCurrentMonth: true,
        status
      });
    }
    
    // Add next month's leading days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dateString: formatDate(date),
        isCurrentMonth: false,
        status: "available"
      });
    }
    
    setCalendarDays(days);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getStatusColor = (status: CalendarDay["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer";
      case "booked":
        return "bg-red-100 text-red-800 cursor-not-allowed";
      case "reserved":
        return "bg-yellow-100 text-yellow-800 cursor-not-allowed";
      case "past":
        return "bg-gray-100 text-gray-400 cursor-not-allowed";
      default:
        return "bg-white";
    }
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.status === "available" && day.isCurrentMonth) {
      onDateSelect(day.dateString);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const isSelected = day.dateString === selectedDate;
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative p-3 rounded-lg text-center transition-all
                ${getStatusColor(day.status)}
                ${!day.isCurrentMonth ? "opacity-40" : ""}
                ${isSelected ? "ring-2 ring-orange-500 ring-offset-2" : ""}
              `}
            >
              <span className={`text-sm ${!day.isCurrentMonth ? "text-gray-400" : ""}`}>
                {day.date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
            <span className="text-gray-600">Reserved (Pending)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-gray-600">Booked (Confirmed)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-gray-600">Past Date</span>
          </div>
        </div>
      </div>
    </div>
  );
}
