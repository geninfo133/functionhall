"use client";

import { useState } from "react";

interface CountryCodeOption {
  code: string;
  name: string;
  flag: string;
}

const countries: CountryCodeOption[] = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
];

interface CountryCodeSelectorProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export default function CountryCodeSelector({ value, onChange, className = "" }: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedCountry = countries.find(c => c.code === value) || countries[0];
  
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 rounded-lg bg-white flex items-center justify-between hover:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedCountry.flag}</span>
          <span className="font-medium">{selectedCountry.code}</span>
          <span className="text-gray-600">{selectedCountry.name}</span>
        </div>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="overflow-y-auto max-h-64">
              {filteredCountries.map((country) => (
                <button
                  key={country.code + country.name}
                  type="button"
                  onClick={() => handleSelect(country.code)}
                  className={`w-full px-4 py-3 flex items-center gap-2 hover:bg-orange-50 transition ${
                    country.code === value ? 'bg-orange-100' : ''
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-medium">{country.code}</span>
                  <span className="text-gray-600">{country.name}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  No countries found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
