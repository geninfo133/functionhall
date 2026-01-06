import Link from "next/link";
import Image from "next/image";
import { FaHome, FaCalendarCheck, FaUser, FaSignOutAlt, FaTachometerAlt, FaBuilding, FaPlusCircle, FaBox, FaCalendarAlt, FaUsers, FaFileInvoiceDollar, FaCog, FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { ReactElement } from "react";

export type Role = "customer" | "vendor" | "admin";

interface SidebarProps {
  role: Role;
}

const sidebarOptions: Record<Role, { label: string; href: string; icon: ReactElement }[]> = {
  customer: [
    { label: "Dashboard", href: "/customer/dashboard", icon: <FaTachometerAlt /> },
    { label: "Home", href: "/home", icon: <FaHome /> },
    { label: "Send Enquiry", href: "/customer/enquiry", icon: <FaEnvelope /> },
    { label: "My Bookings", href: "/my-bookings", icon: <FaCalendarCheck /> },
    { label: "Profile", href: "/profile", icon: <FaUser /> },
    { label: "Logout", href: "/logout", icon: <FaSignOutAlt /> },
  ],
  vendor: [
    { label: "Dashboard", href: "/vendor/dashboard", icon: <FaTachometerAlt /> },
    { label: "My Halls", href: "/vendor/halls", icon: <FaBuilding /> },
    { label: "Add/Edit Hall", href: "/vendor/halls/add", icon: <FaPlusCircle /> },
    { label: "Manage Packages", href: "/vendor/packages", icon: <FaBox /> },
    { label: "View Bookings", href: "/vendor/bookings", icon: <FaCalendarCheck /> },
    { label: "View Enquiries", href: "/admin/enquiries", icon: <FaEnvelope /> },
    { label: "Calendar", href: "/vendor/calendar", icon: <FaCalendarAlt /> },
    { label: "Profile", href: "/profile", icon: <FaUser /> },
    { label: "Logout", href: "/logout", icon: <FaSignOutAlt /> },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { label: "Profile", href: "/admin/profile", icon: <FaUser /> },
    { label: "Enquiries", href: "/admin/enquiries", icon: <FaEnvelope /> },
    { label: "Logout", href: "/logout", icon: <FaSignOutAlt /> },
  ],
};

export default function RoleSidebar({ role }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 h-screen shadow-lg flex flex-col p-6 rounded-r-2xl border-r border-slate-700">
      <nav className="flex-1">
        <div className="mb-4 px-4">
          <p className="text-lg tracking-wider text-slate-300 font-bold pb-2 border-b-2 border-slate-600" style={{ fontFamily: 'Arial, sans-serif' }}>Navigation Menu</p>
        </div>
        <ul className="space-y-2">
          {sidebarOptions[role].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 font-bold transition">
                <span className="text-slate-400">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
