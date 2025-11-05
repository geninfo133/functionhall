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
        <Link href="/auth/login" className="font-bold text-indigo-900 px-5 py-2 rounded-lg bg-indigo-800 hover:bg-indigo-900 text-white transition shadow" style={{textDecoration: 'none'}}>Get started</Link>
      </div>
    </nav>
  );
}
