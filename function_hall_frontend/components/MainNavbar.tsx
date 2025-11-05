import Link from "next/link";

export default function MainNavbar() {
  return (
    <nav className="bg-white shadow flex items-center px-8 py-4 justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-blue-700">FunctionHall</span>
        <Link href="/home" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
        <Link href="/halls" className="text-gray-700 hover:text-blue-600 font-medium">Halls</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/booking" className="text-gray-700 hover:text-blue-600 font-medium">Book</Link>
        <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
        <Link href="/my-bookings" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
      </div>
    </nav>
  );
}
