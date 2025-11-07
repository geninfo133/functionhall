"use client";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import HallTable from "../../../components/HallTable";

export default function AdminHallsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 w-full">
          <h1 className="text-3xl font-bold mb-6 text-orange-500">Manage Halls</h1>
          <HallTable />
        </main>
      </div>
    </div>
  );
}
