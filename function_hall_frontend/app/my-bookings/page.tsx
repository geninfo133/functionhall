import MainNavbar from "../../components/MainNavbar";

export default function MyBookingsPage() {
  return (
    <>
      <MainNavbar />
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        {/* List of user bookings, status, cancellation option will go here */}
      </main>
    </>
  );
}
