// lib/data.ts
// All data is now fetched dynamically from the backend API
// No static data - everything comes from the database

// Package Templates for vendors to choose from
export const PACKAGE_TEMPLATES = [
  {
    package_name: "Basic Package",
    price: 50000,
    details: "Includes: Basic lighting, Tables & chairs, Air conditioning"
  },
  {
    package_name: "Standard Package",
    price: 75000,
    details: "Includes: Premium lighting, Tables & chairs, Air conditioning, Sound system, Stage setup"
  },
  {
    package_name: "Premium Package",
    price: 100000,
    details: "Includes: Premium lighting & effects, Decorated tables & chairs, Air conditioning, Professional sound system, Stage with backdrop, Complementary parking"
  },
  {
    package_name: "Deluxe Package",
    price: 150000,
    details: "Includes: LED lighting & effects, Premium decorated tables & chairs, Central air conditioning, Professional sound & DJ system, Premium stage setup, Valet parking, Welcome drinks"
  },
  {
    package_name: "Wedding Package",
    price: 200000,
    details: "Includes: Complete wedding lighting & decoration, Premium furniture, Central AC, Professional sound & music, Mandap setup, Valet parking, Welcome area setup, Green room facilities"
  },
  {
    package_name: "Corporate Package",
    price: 80000,
    details: "Includes: Professional lighting, Conference tables & chairs, AC, Projector & screen, Sound system with microphones, High-speed WiFi, Tea/coffee service"
  },
  {
    package_name: "Birthday Party Package",
    price: 40000,
    details: "Includes: Colorful lighting, Party tables & chairs, AC, Music system, Birthday stage decoration, Parking facility"
  },
  {
    package_name: "Anniversary Package",
    price: 90000,
    details: "Includes: Romantic lighting & ambiance, Decorated seating, AC, Sound system, Photo booth area, Cake table setup, Parking"
  }
];

// Functional Room Templates (VIP, Green, Conference, etc.)
export const FUNCTIONAL_ROOM_TYPES = [
  {
    room_type: "VIP Room",
    typical_price: 5000,
    description: "Exclusive VIP lounge with premium seating, private restroom, and refreshments area",
    amenities: "Premium furniture, Private restroom, AC, Mini refrigerator"
  },
  {
    room_type: "Green Room",
    typical_price: 3000,
    description: "Private preparation room with mirrors, seating, and changing facilities",
    amenities: "Full-length mirrors, Changing area, Seating, AC, Attached restroom"
  },
  {
    room_type: "Conference Room",
    typical_price: 8000,
    description: "Professional meeting space with presentation equipment",
    amenities: "Projector, Screen, Conference table, Chairs, Whiteboard, AC, WiFi"
  },
  {
    room_type: "Bridal Suite",
    typical_price: 10000,
    description: "Luxurious suite for bride preparation with makeup area and private facilities",
    amenities: "Makeup station, Premium lighting, Changing room, Attached bathroom, AC, Sofa"
  }
];

// Guest Room Templates (Hotel-style accommodation)
export const GUEST_ROOM_TYPES = [
  {
    room_category: "Standard Room",
    typical_price: 2000,
    bed_type: "Double",
    max_occupancy: 2,
    description: "Comfortable standard room with essential amenities",
    amenities: "Double bed, AC, TV, WiFi, Attached bathroom, Hot water"
  },
  {
    room_category: "Deluxe Room",
    typical_price: 3500,
    bed_type: "Queen",
    max_occupancy: 3,
    description: "Spacious deluxe room with premium facilities",
    amenities: "Queen bed, AC, LED TV, WiFi, Mini fridge, Premium bathroom, Hot water, Room service"
  },
  {
    room_category: "Suite",
    typical_price: 6000,
    bed_type: "King",
    max_occupancy: 4,
    description: "Luxurious suite with separate living area",
    amenities: "King bed, Separate living area, AC, Smart TV, WiFi, Mini bar, Premium bathroom, Balcony, 24/7 room service"
  },
  {
    room_category: "Family Room",
    typical_price: 4500,
    bed_type: "Multiple",
    max_occupancy: 5,
    description: "Large family room with multiple beds",
    amenities: "2 Double beds, AC, TV, WiFi, Spacious bathroom, Hot water, Extra mattress available"
  }
];
