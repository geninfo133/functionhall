import MainNavbar from "../../components/MainNavbar";

export default function HallListPage() {
  return (
    <>
      <MainNavbar />
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">All Function Halls</h1>
        {/* Filters, grid of hall cards will go here */}
      </main>
    </>
  );
}
