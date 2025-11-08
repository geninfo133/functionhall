import Link from "next/link";

export type Role = "customer" | "vendor" | "admin";

interface SidebarProps {
  role: Role;
  onEnquiryClick?: () => void;
}

const sidebarOptions: Record<Role, { label: string; href?: string }[]> = {
  customer: [
    { label: "Home", href: "/home" },
    { label: "Browse Halls", href: "/halls" },
    { label: "My Bookings", href: "/my-bookings" },
    { label: "Enquiry" },
    { label: "Profile", href: "/profile" },
    { label: "Logout", href: "/logout" },
  ],
  vendor: [
    { label: "Dashboard", href: "/vendor/dashboard" },
    { label: "My Halls", href: "/vendor/halls" },
    { label: "Add/Edit Hall", href: "/vendor/halls/add" },
    { label: "Manage Packages", href: "/vendor/packages" },
    { label: "View Bookings", href: "/vendor/bookings" },
    { label: "Calendar", href: "/vendor/calendar" },
    { label: "Profile", href: "/profile" },
    { label: "Logout", href: "/logout" },
  ],
  admin: [
    { label: "Admin Dashboard", href: "/admin/dashboard" },
    { label: "Approve Halls", href: "/admin/halls" },
    { label: "Manage Users", href: "/admin/users" },
    { label: "Manage Bookings", href: "/admin/bookings" },
    { label: "Revenue/Reports", href: "/admin/reports" },
    { label: "System Settings", href: "/admin/settings" },
    { label: "Logout", href: "/logout" },
  ],
};

export default function RoleSidebar({ role, onEnquiryClick }: SidebarProps) {
  console.log('sidebarOptions[role]', sidebarOptions[role]);
  return (
    <aside className="w-64 bg-white h-screen shadow-lg flex flex-col p-6 rounded-r-2xl">
      <div className="mb-10 flex items-center space-x-2">
        <span className="text-2xl font-bold text-orange-500 tracking-tight">FunctionHall</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarOptions[role].map((item) => (
            <li key={item.href || item.label}>
              {item.label === "Enquiry" && typeof onEnquiryClick === "function" ? (
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 font-medium transition"
                  onClick={onEnquiryClick}
                >
                  {item.label}
                </button>
              ) : (
                item.href ? (
                  <Link href={item.href} className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 font-medium transition">
                    {item.label}
                  </Link>
                ) : null
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
