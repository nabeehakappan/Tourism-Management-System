import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Map,
  Briefcase,
  CalendarDays,
  CreditCard,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/" },
  { name: "Tourists", icon: Users, path: "/tourists" },
    { name: "Packages", icon: Briefcase, path: "/packages" },
  { name: "Bookings", icon: CalendarDays, path: "/bookings" },
  { name: "Payments", icon: CreditCard, path: "/payments" },
  { name: "Guides", icon: UserRound, path: "/guides" },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#1C1C1C] text-white flex flex-col">

      {/* Logo */}
      <div className="px-7 pt-8 pb-10">
        <h1 className="font-['Playfair_Display'] text-2xl tracking-wide">
          TRAVELIA
        </h1>

        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A9A49C] mt-2">
          Tourism Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#77736D] px-3 mb-4">
          Menu
        </p>

        <div className="space-y-1">
  {menuItems.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.name}
        to={item.path}
        end={item.path === "/"}
        className={({ isActive }) =>
          `w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition ${
            isActive
              ? "bg-white/10 text-white"
              : "text-[#A9A49C] hover:bg-white/5 hover:text-white"
          }`
        }
      >
        <Icon size={18} strokeWidth={1.7} />
        <span>{item.name}</span>
      </NavLink>
    );
  })}
</div>

      </nav>

      {/* Bottom */}
      <div className="px-4 pb-6 space-y-1">

        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-[#A9A49C] hover:bg-white/5 hover:text-white transition">
          <Settings size={18} strokeWidth={1.7} />
          Settings
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-[#A9A49C] hover:bg-white/5 hover:text-white transition">
          <LogOut size={18} strokeWidth={1.7} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;