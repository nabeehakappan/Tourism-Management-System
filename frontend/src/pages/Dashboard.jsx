import {
  Users,
  CalendarCheck,
  IndianRupee,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Tourists",
    value: "1,248",
    change: "+12.5%",
    icon: Users,
  },
  {
    label: "Active Bookings",
    value: "86",
    change: "+8.2%",
    icon: CalendarCheck,
  },
  {
    label: "Total Revenue",
    value: "₹8.4L",
    change: "+15.8%",
    icon: IndianRupee,
  },
  {
    label: "Destinations",
    value: "24",
    change: "+4.3%",
    icon: MapPin,
  },
];

const destinations = [
  { name: "Goa", bookings: 42, percentage: 82 },
  { name: "Kerala", bookings: 31, percentage: 65 },
  { name: "Rajasthan", bookings: 24, percentage: 50 },
  { name: "Kashmir", bookings: 18, percentage: 38 },
];

function Dashboard() {
  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-[#8B7355] mb-2">
          Sunday, September 6, 2026
        </p>

        <h2 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
          Good evening, Admin.
        </h2>

        <p className="text-sm text-[#77736D] mt-2">
          Here's an overview of your tourism operations.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E6E1D8] rounded-xl p-5"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-xs text-[#77736D] uppercase tracking-wide">
                    {stat.label}
                  </p>

                  <p className="text-3xl font-semibold text-[#1C1C1C] mt-3">
                    {stat.value}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-[#F1ECE4] flex items-center justify-center">
                  <Icon
                    size={19}
                    strokeWidth={1.6}
                    className="text-[#8B7355]"
                  />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4 text-xs text-[#6F8068]">
                <ArrowUpRight size={14} />
                {stat.change}
                <span className="text-[#99958E] ml-1">
                  from last month
                </span>
              </div>

            </div>
          );
        })}

      </div>

      {/* Lower section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue */}
        <div className="xl:col-span-2 bg-white border border-[#E6E1D8] rounded-xl p-6">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-[#1C1C1C]">
                Revenue overview
              </h3>

              <p className="text-xs text-[#77736D] mt-1">
                Monthly revenue performance
              </p>
            </div>

            <select className="text-xs border border-[#E6E1D8] rounded-lg px-3 py-2 bg-white text-[#77736D] outline-none">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          {/* Simple chart placeholder */}
          <div className="h-56 flex items-end gap-5 px-4">

            {[45, 60, 52, 75, 68, 90].map((height, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col justify-end items-center gap-3"
              >
                <div
                  className="w-full max-w-12 bg-[#D8CFC1] rounded-t-md hover:bg-[#8B7355] transition"
                  style={{ height: `${height}%` }}
                />

                <span className="text-[11px] text-[#99958E]">
                  {["Apr", "May", "Jun", "Jul", "Aug", "Sep"][index]}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* Popular destinations */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl p-6">

          <div className="mb-7">
            <h3 className="text-lg font-semibold text-[#1C1C1C]">
              Popular destinations
            </h3>

            <p className="text-xs text-[#77736D] mt-1">
              Based on current bookings
            </p>
          </div>

          <div className="space-y-6">

            {destinations.map((destination) => (
              <div key={destination.name}>

                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#1C1C1C]">
                    {destination.name}
                  </span>

                  <span className="text-xs text-[#77736D]">
                    {destination.bookings} bookings
                  </span>
                </div>

                <div className="h-1.5 bg-[#F1ECE4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8B7355] rounded-full"
                    style={{
                      width: `${destination.percentage}%`,
                    }}
                  />
                </div>

              </div>
            ))}

          </div>

          <button className="flex items-center gap-2 text-xs text-[#8B7355] mt-8 hover:text-[#1C1C1C] transition">
            View all destinations
            <ArrowUpRight size={14} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;