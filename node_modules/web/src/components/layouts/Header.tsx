import { ThemeToggle } from "@/components/theme-toggle";

export const Header = () => {
 
  return (
    <header className="h-18 border-b border-lines bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8 transition-colors duration-300">
      <div className="relative w-96 group">
        
      </div>

      <div className="flex items-center gap-4">

        <div className="h-6 w-[1px] bg-lines" />
        <ThemeToggle />
      </div>
    </header>
  );
};