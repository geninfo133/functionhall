"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center border-b border-slate-700">
      <h1 className="text-2xl font-bold">Function Hall Booking</h1>
      <nav className="space-x-6">
        <Link href="/" className="hover:text-slate-300">Home</Link>
        <Link href="/about" className="hover:text-slate-300">About</Link>
        <Link href="/contact" className="hover:text-slate-300">Contact</Link>
      </nav>
    </header>
  );
}
