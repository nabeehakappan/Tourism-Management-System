import { Search, Bell } from "lucide-react";

function Topbar() {
  return (
    <header className="h-20 bg-[#F7F5F0] border-b border-[#E6E1D8] flex items-center justify-between px-8">

      {/* Search */}
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99958E]"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-white border border-[#E6E1D8] rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#8B7355] transition"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">

        <button className="relative text-[#77736D] hover:text-[#1C1C1C] transition">
          <Bell size={19} strokeWidth={1.7} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#8B7355] rounded-full" />
        </button>

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-[#D8CFC1] flex items-center justify-center text-sm font-medium text-[#1C1C1C]">
            A
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#1C1C1C]">
              Admin
            </p>

            <p className="text-xs text-[#77736D]">
              Administrator
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;