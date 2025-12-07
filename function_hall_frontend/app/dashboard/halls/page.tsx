// app/dashboard/halls/page.tsx
// Update the import path if HallTable is located elsewhere, for example:
import HallCards from "@/components/HallCards";
// If HallTable is actually in a different folder, update the path accordingly, e.g.:
// import HallTable from "../components/HallTable";
// or
// import HallTable from "../../../components/HallTable";

export default function HallsPage() {
  return (
    <div>
      <HallCards />
    </div>
  );
}
