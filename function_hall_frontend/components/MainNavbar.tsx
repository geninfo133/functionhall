"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaHome, FaCalendarPlus, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaUser } from "react-icons/fa";

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
        <Image src="/G.png" alt="Logo" width={40} height={40} />
        <span className="text-2xl font-bold text-black">GenS <span className="text-orange-500">Services</span></span>
        <Link href="/home" className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium">
          <FaHome />
          <span>Home</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {!isAdminPage && (
          isCustomerLoggedIn ? (
            <Link href="/booking" className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium">
              <FaCalendarPlus />
              <span>Book</span>
            </Link>
          ) : (
            <Link href="/customer/phone-verify" className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 font-medium">
              <FaCalendarPlus />
              <span>Book</span>
            </Link>
          )
        )}
        {isCustomerLoggedIn && !isAdminPage && (
          <span className="flex items-center space-x-2 text-gray-700 font-medium">
            <FaUser className="text-orange-500" />
            <span>Welcome, {customerName}</span>
          </span>
        )}
        <button
          className="flex items-center space-x-2 bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition"
          onClick={handleAuthClick}
        >
          {isAdminPage || isCustomerLoggedIn ? <FaSignOutAlt /> : <FaSignInAlt />}
          <span>{isAdminPage ? 'Logout' : (isCustomerLoggedIn ? 'Logout' : 'Login')}</span>
        </button>
        {!isCustomerLoggedIn && !isAdminPage && (
          <Link 
            href="/customer/phone-verify"
            className="flex items-center space-x-2 bg-white text-orange-500 border-2 border-orange-500 px-5 py-2 rounded-lg font-semibold shadow hover:bg-orange-50 transition"
          >
            <FaUserPlus />
            <span>Register</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
