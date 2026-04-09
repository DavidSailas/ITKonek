import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold tracking-tight font-poppins text-foreground">
                    IT Professionals
                </h2>
                <p className="text-description text-sm leading-none">
                    Manage IT professionals.
                </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative group flex-1 sm:w-72">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-description group-focus-within:text-tint transition-colors pointer-events-none"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search professional..."
                        className="w-full h-10 bg-background border border-lines rounded-xl pl-10 pr-4 text-sm focus:ring-1 focus:ring-tint focus:border-tint transition-all outline-none font-poppins text-foreground placeholder:text-description/50"
                    />
                </div>
                <Button className="h-10 rounded-xl px-5 bg-tint hover:bg-tint/90 text-btn-text gap-2 font-poppins shadow-sm shadow-tint/20 active:scale-95 transition-all whitespace-nowrap">
                    <Plus size={18} strokeWidth={2.5} />
                    <span className="xs:inline">Add Professional</span>
                </Button>
            </div>
        </div>
    );
};