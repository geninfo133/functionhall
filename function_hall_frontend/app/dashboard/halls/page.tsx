// app/dashboard/halls/page.tsx
// Update the import path if HallTable is located elsewhere, for example:
import HallTable from "@/components/HallTable";
// If HallTable is actually in a different folder, update the path accordingly, e.g.:
// import HallTable from "../components/HallTable";
// or
// import HallTable from "../../../components/HallTable";

export default function HallsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Function Halls</h1>
      <HallTable />
    </div>
  );
}
