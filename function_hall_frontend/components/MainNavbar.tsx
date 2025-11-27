"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function MainNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    // Check if customer is logged in
    const token = localStorage.getItem('customerToken');
    const customerInfo = localStorage.getItem('customerInfo');
    
    if (token && customerInfo) {
      setIsCustomerLoggedIn(true);
      const info = JSON.parse(customerInfo);
      setCustomerName(info.name);
    }
  }, [pathname]);

  const handleAuthClick = () => {
    if (isAdminPage) {
      // Logout for admin
      localStorage.removeItem('adminToken');
      router.push("/admin/login");
    } else {
      if (isCustomerLoggedIn) {
        // Logout customer
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerInfo');
        setIsCustomerLoggedIn(false);
        setCustomerName("");
        router.push("/customer/login");
      } else {
        // Login for customers
        router.push("/customer/login");
      }
    }
  };

  return (
    <nav className="w-full bg-white shadow flex items-center px-8 py-4 justify-between border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-black">GenS <span className="text-orange-500">Services</span></span>
        <Link href="/home" className="text-gray-700 hover:text-orange-600 font-medium">Home</Link>
      </div>
      <div className="flex items-center space-x-4">
        {!isAdminPage && (
          <Link href="/booking" className="text-gray-700 hover:text-orange-600 font-medium">Book</Link>
        )}
        {isCustomerLoggedIn && !isAdminPage && (
          <span className="text-gray-700 font-medium">Welcome, {customerName}</span>
        )}
        <button
          className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition"
          onClick={handleAuthClick}
        >
          {isAdminPage ? 'Logout' : (isCustomerLoggedIn ? 'Logout' : 'Login')}
        </button>
        {!isCustomerLoggedIn && !isAdminPage && (
          <Link 
            href="/customer/register"
            className="bg-white text-orange-500 border-2 border-orange-500 px-5 py-2 rounded-lg font-semibold shadow hover:bg-orange-50 transition"
          >
            Register
          </Link>
        )}
      </div>
    </nav>
  );
}
