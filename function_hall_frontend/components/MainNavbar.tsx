"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaBuilding, FaInfoCircle, FaPhone, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaUser, FaCalendarAlt, FaBars, FaTimes, FaCalendarPlus, FaChevronDown } from "react-icons/fa";

export default function MainNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isVendorPage = pathname?.startsWith('/vendor');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if customer is logged in
    const token = localStorage.getItem('customerToken');
    const customerInfo = localStorage.getItem('customerInfo');
    
    if (token && customerInfo) {
      setIsCustomerLoggedIn(true);
      const info = JSON.parse(customerInfo);
      setCustomerName(info.name);
    }

    // Check if vendor is logged in
    const vendorToken = localStorage.getItem('vendorToken');
    const vendorInfo = localStorage.getItem('vendorInfo');
    
    if (vendorToken && vendorInfo) {
      setIsVendorLoggedIn(true);
      const info = JSON.parse(vendorInfo);
      setVendorName(info.name);
    }

    // Check if admin is logged in (only on admin pages)
    const isAdmin = pathname?.startsWith('/admin');
    if (isAdmin) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        setIsAdminLoggedIn(true);
      }
    }
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRegisterDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (isAdminPage) {
      // Logout for admin
      localStorage.removeItem('adminToken');
      router.push("/admin/login");
    } else if (isVendorLoggedIn) {
      // Logout vendor
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorInfo');
      setIsVendorLoggedIn(false);
      setVendorName("");
      router.push("/vendor/login");
    } else {
      // Logout customer
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerInfo');
      setIsCustomerLoggedIn(false);
      setCustomerName("");
      router.push("/home");
    }
    setSidebarOpen(false);
  };

  return (
    <>
      <nav className="bg-black sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/home" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img src="/g.png" alt="GenS Services" className="w-8 h-8 object-cover" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">GenS Services</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/home" className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                <FaBuilding />
                Home
              </Link>
              <Link href="/halls" className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                <FaBuilding />
                Browse Halls
              </Link>
              {!isCustomerLoggedIn && !isAdminLoggedIn && !isVendorLoggedIn && (
                <>
                  <Link href="/about" className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                    <FaInfoCircle />
                    About
                  </Link>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                    <FaPhone />
                    Contact
                  </Link>
                </>
              )}
              
              {isCustomerLoggedIn ? (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
                >
                  <FaUser />
                  {customerName}
                  <FaBars className="ml-2" />
                </button>
              ) : isVendorLoggedIn ? (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
                >
                  <FaBuilding />
                  {vendorName}
                  <FaBars className="ml-2" />
                </button>
              ) : isAdminLoggedIn && isAdminPage ? (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
                >
                  <FaUser />
                  Admin
                  <FaBars className="ml-2" />
                </button>
              ) : (
                <>
                  {/* Login Dropdown */}
                  <div className="relative" ref={loginDropdownRef}>
                    <button
                      onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                      className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
                    >
                      <FaSignInAlt />
                      Login
                      <FaChevronDown className={`text-xs transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {loginDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                        <Link
                          href="/customer/login"
                          onClick={() => setLoginDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-gray-700"
                        >
                          <FaUser className="text-blue-600" />
                          <span className="font-medium">Customer</span>
                        </Link>
                        <div className="border-t border-gray-200"></div>
                        <Link
                          href="/vendor/login"
                          onClick={() => setLoginDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition text-gray-700"
                        >
                          <FaBuilding className="text-green-600" />
                          <span className="font-medium">Vendor</span>
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Register Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center gap-2"
                    >
                      <FaUserPlus />
                      Register
                      <FaChevronDown className={`text-xs transition-transform ${registerDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {registerDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                        <Link
                          href="/customer/phone-verify"
                          onClick={() => setRegisterDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-gray-700"
                        >
                          <FaUser className="text-blue-600" />
                          <span className="font-medium">Customer</span>
                        </Link>
                        <div className="border-t border-gray-200"></div>
                        <Link
                          href="/vendor/phone-verify"
                          onClick={() => setRegisterDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition text-gray-700"
                        >
                          <FaBuilding className="text-green-600" />
                          <span className="font-medium">Vendor</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            {(isCustomerLoggedIn || isVendorLoggedIn || (isAdminLoggedIn && isAdminPage)) && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-white p-2"
              >
                <FaBars size={24} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Customer/Vendor/Admin Sidebar */}
      {(isCustomerLoggedIn || isVendorLoggedIn || (isAdminLoggedIn && isAdminPage)) && (
        <>
          {/* Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className={`${isVendorLoggedIn ? 'bg-green-600' : 'bg-blue-600'} text-white p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${isVendorLoggedIn ? 'bg-green-700' : 'bg-blue-700'} rounded-full flex items-center justify-center`}>
                    {isVendorLoggedIn ? <FaBuilding size={20} /> : <FaUser size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {isAdminLoggedIn ? 'Admin' : isVendorLoggedIn ? vendorName : customerName}
                    </p>
                    <p className={`text-sm ${isVendorLoggedIn ? 'text-green-100' : 'text-blue-100'}`}>
                      {isAdminLoggedIn ? 'Administrator' : isVendorLoggedIn ? 'Vendor' : 'Customer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="flex-1 p-4">
                {isVendorLoggedIn ? (
                  <>
                    <Link
                      href="/vendor/dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition mb-2"
                    >
                      <FaBuilding size={18} />
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                      href="/vendor/dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition mb-2"
                    >
                      <FaBuilding size={18} />
                      <span className="font-medium">My Halls</span>
                    </Link>

                    <Link
                      href="/halls"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition mb-2"
                    >
                      <FaBuilding size={18} />
                      <span className="font-medium">Browse All Halls</span>
                    </Link>
                  </>
                ) : isAdminLoggedIn ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaUser size={18} />
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                      href="/admin/halls"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaBuilding size={18} />
                      <span className="font-medium">Function Halls</span>
                    </Link>

                    <Link
                      href="/admin/bookings"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaCalendarAlt size={18} />
                      <span className="font-medium">Manage Bookings</span>
                    </Link>

                    <Link
                      href="/admin/customers"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaUser size={18} />
                      <span className="font-medium">Manage Customers</span>
                    </Link>

                    <Link
                      href="/admin/enquiries"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaInfoCircle size={18} />
                      <span className="font-medium">Enquiries</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaUser size={18} />
                      <span className="font-medium">Profile</span>
                    </Link>

                    <Link
                      href="/my-bookings"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaCalendarAlt size={18} />
                      <span className="font-medium">My Bookings</span>
                    </Link>

                    <Link
                      href="/halls"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaBuilding size={18} />
                      <span className="font-medium">Browse Halls</span>
                    </Link>

                    <Link
                      href="/booking"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition mb-2"
                    >
                      <FaCalendarPlus size={18} />
                      <span className="font-medium">Book</span>
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-200 my-4"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <FaSignOutAlt size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
