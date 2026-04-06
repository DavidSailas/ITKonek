import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Briefcase,
  ShieldCheck,
  LogOut,
  CreditCard,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export const Sidebar = () => {
  const { role, details } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  // To do: Make a this as a file at features/auth/hooks
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // To do: Make this into a collection
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Bookings', icon: CalendarCheck, path: '/dashboard/bookings' },
    { name: 'IT Professionals', icon: Briefcase, path: '/dashboard/pros' },
    { name: 'Customers', icon: Users, path: '/dashboard/customers' },
    { name: 'Services', icon: ShieldCheck, path: '/dashboard/services' },
  ];

  const superAdminItems = [
    { name: 'Revenue & Payouts', icon: CreditCard, path: '/dashboard/finance' },
    { name: 'Platform Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { name: 'Support Tickets', icon: MessageSquare, path: '/dashboard/support' },
  ];

  // Temporary: Get Initials
  const getInitials = () => {
    if (!details?.firstName) return role?.[0]?.toUpperCase() || "A";

    const names = details.firstName.trim().split(" ");

    if (names.length > 1) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }

    return names[0][0].toUpperCase();
  };


  return (
    <aside className="w-64 h-screen bg-background text-foreground flex flex-col border-r border-lines sticky top-0 transition-colors duration-300">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-tint rounded-xl flex items-center justify-center text-btn-text font-bold shadow-lg shadow-tint/20 transition-transform hover:scale-105">
            {getInitials()}
          </div>
          <div>
            <h1 className="text-xs font-semibold leading-none font-poppins">{details?.firstName || role}</h1>
            <p className="text-[8px] text-tint font-bold tracking-widest uppercase mt-1">{role} Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-description mb-3 opacity-70">Overview</p>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                isActive
                  ? "bg-tint/10 text-tint"
                  : "text-description hover:bg-tint/5 hover:text-foreground"
              )}
            >
              <item.icon size={19} className={cn("transition-transform group-hover:scale-110", isActive && "text-tint")} />
              <span className="text-sm font-medium font-poppins">{item.name}</span>
            </Link>
          );
        })}

        {role === 'superadmin' && (
          <div className="pt-8">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-description mb-3 opacity-70">System Control</p>
            {superAdminItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group",
                    isActive
                      ? "bg-tint/10 text-tint"
                      : "text-description hover:bg-tint/5 hover:text-foreground"
                  )}
                >
                  <item.icon size={19} className={cn("transition-transform group-hover:scale-110", isActive && "text-tint")} />
                  <span className="text-sm font-medium font-poppins">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-lines mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-description hover:bg-destructive/10 hover:text-destructive w-full rounded-xl transition-all group text-left outline-none font-poppins"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};