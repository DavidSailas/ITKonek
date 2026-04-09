import { BookingsTable } from "@/features/bookings/components/BookingsTable";
import { Header } from "@/features/bookings/components/Header";
import type { Booking } from "@/features/bookings/components/columns";

import bookingsData from "@/features/bookings/data/bookings.json";

export default function BookingsPage() {

    const data = bookingsData as Booking[];

    return (
        <div className="space-y-6">
            <Header />

            <BookingsTable data={data} />
        </div>

    );
}