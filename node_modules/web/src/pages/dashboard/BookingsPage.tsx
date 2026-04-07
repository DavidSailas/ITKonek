import { BookingsTable } from "@/features/bookings/components/BookingsTable";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="flex-1 flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight font-poppins">Bookings</h2>
                    <p className="text-description text-sm">Monitor fleet service requests.</p>
                    <div className="relative max-w-sm">
                        <Search
                            className="absolute left-3 top-4 -translate-y-1/2 text-description group-focus-within:text-tint transition-colors"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="w-full bg-background border border-lines rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-tint focus:border-tint transition-all outline-none font-poppins text-foreground placeholder:text-description/50"
                        />
                    </div>
                </div>
                <Button className="rounded-lg px-3.5  bg-tint hover:bg-tint/90 text-btn-text gap-2">
                    <Plus size={18} /> New Booking
                </Button>
            </div>
            <BookingsTable />
        </div>
    );
}