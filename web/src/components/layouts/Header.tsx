import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  role: 'admin' | 'superadmin';
}

export const Header = ({ role }: HeaderProps) => {
  return (
    <header className="h-18 border-b border-lines bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8 transition-colors duration-300">

      <div className="relative w-96 group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-description group-focus-within:text-tint transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Search bookings or professionals..."
          className="w-full bg-background border border-lines rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-tint focus:border-tint transition-all outline-none font-poppins text-foreground placeholder:text-description/50"
        />
      </div>

      <div className="flex items-center gap-4">
       

        <div className="h-6 w-[1px] bg-lines" />
        <ThemeToggle />
      </div>
    </header>
  );
};