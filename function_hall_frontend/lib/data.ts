// lib/data.ts
// All data is now fetched dynamically from the backend API
// No static data - everything comes from the database

// Package Templates for vendors to choose from
export const PACKAGE_TEMPLATES = [
  {
    package_name: "Basic Package",
    price: 50000,
    details: "Includes: Hall rental, Basic lighting, Tables & chairs, Air conditioning"
  },
  {
    package_name: "Standard Package",
    price: 75000,
    details: "Includes: Hall rental, Premium lighting, Tables & chairs, Air conditioning, Sound system, Stage setup"
  },
  {
    package_name: "Premium Package",
    price: 100000,
    details: "Includes: Hall rental, Premium lighting & effects, Decorated tables & chairs, Air conditioning, Professional sound system, Stage with backdrop, Complementary parking"
  },
  {
    package_name: "Deluxe Package",
    price: 150000,
    details: "Includes: Hall rental, LED lighting & effects, Premium decorated tables & chairs, Central air conditioning, Professional sound & DJ system, Premium stage setup, Valet parking, Welcome drinks"
  },
  {
    package_name: "Wedding Package",
    price: 200000,
    details: "Includes: Hall rental for 2 days, Complete wedding lighting & decoration, Premium furniture, Central AC, Professional sound & music, Mandap setup, Valet parking, Welcome area setup, Green room facilities"
  },
  {
    package_name: "Corporate Package",
    price: 80000,
    details: "Includes: Hall rental, Professional lighting, Conference tables & chairs, AC, Projector & screen, Sound system with microphones, High-speed WiFi, Tea/coffee service"
  },
  {
    package_name: "Birthday Party Package",
    price: 40000,
    details: "Includes: Hall rental, Colorful lighting, Party tables & chairs, AC, Music system, Birthday stage decoration, Parking facility"
  },
  {
    package_name: "Anniversary Package",
    price: 90000,
    details: "Includes: Hall rental, Romantic lighting & ambiance, Decorated seating, AC, Sound system, Photo booth area, Cake table setup, Parking"
  }
];
