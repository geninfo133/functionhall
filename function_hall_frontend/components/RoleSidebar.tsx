import Link from "next/link";
import { FaHome, FaCalendarCheck, FaUser, FaSignOutAlt, FaTachometerAlt, FaBuilding, FaPlusCircle, FaBox, FaCalendarAlt, FaUsers, FaFileInvoiceDollar, FaCog, FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { ReactElement } from "react";

export type Role = "customer" | "vendor" | "admin";

interface SidebarProps {
  role: Role;
}

const sidebarOptions: Record<Role, { label: string; href: string; icon: ReactElement }[]> = {
  customer: [
    { label: "Home", href: "/home", icon: <FaHome /> },
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
    { label: "Calendar", href: "/vendor/calendar", icon: <FaCalendarAlt /> },
    { label: "Profile", href: "/profile", icon: <FaUser /> },
    { label: "Logout", href: "/logout", icon: <FaSignOutAlt /> },
  ],
  admin: [
    { label: "Admin Dashboard", href: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { label: "Approve Halls", href: "/admin/halls", icon: <FaCheckCircle /> },
    { label: "Manage Users", href: "/admin/users", icon: <FaUsers /> },
    { label: "Manage Bookings", href: "/admin/bookings", icon: <FaCalendarCheck /> },
    { label: "Revenue/Reports", href: "/admin/reports", icon: <FaFileInvoiceDollar /> },
    { label: "System Settings", href: "/admin/settings", icon: <FaCog /> },
    { label: "Logout", href: "/logout", icon: <FaSignOutAlt /> },
  ],
};

export default function RoleSidebar({ role }: SidebarProps) {
  return (
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col p-6 rounded-r-2xl">
      <div className="mb-10 flex items-center space-x-2">
        <span className="text-2xl font-bold text-orange-500 tracking-tight">FunctionHall</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {(role === "customer"
            ? [
                { label: "Enquiry", href: "/customer/enquiry", icon: <FaEnvelope /> },
                ...sidebarOptions[role]
              ]
            : sidebarOptions[role]
          ).map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 font-medium transition">
                <span className="text-orange-500">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
