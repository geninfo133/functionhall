"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";


export default function MainNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  const handleAuthClick = () => {
    if (isAdminPage) {
      // Logout for admin
      localStorage.removeItem('adminToken');
      router.push("/admin/login");
    } else {
      // Login for customers
      router.push("/auth/login");
    }
  };

  return (
    <nav className="w-full bg-white shadow flex items-center px-8 py-4 justify-between border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-black">GenS <span className="text-orange-500">Services</span></span>
        <Link href="/home" className="text-gray-700 hover:text-orange-600 font-medium">Home</Link>
        <Link href="/halls" className="text-gray-700 hover:text-orange-600 font-medium">Halls</Link>
      </div>
      <div className="flex items-center space-x-4">
        {!isAdminPage && (
          <Link href="/booking" className="text-gray-700 hover:text-orange-600 font-medium">Book</Link>
        )}
        <button
          className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition"
          onClick={handleAuthClick}
        >
          {isAdminPage ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
}
