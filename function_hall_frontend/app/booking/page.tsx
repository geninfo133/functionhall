
import dynamic from "next/dynamic";
const BookingPageClient = dynamic(() => import("./client/BookingPageClient"), { ssr: false });

export default function BookingPage() {
  return <BookingPageClient />;
}
