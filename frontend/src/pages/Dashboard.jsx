import { useEffect, useMemo, useState } from "react";
import {
  Users,
  CalendarCheck,
  IndianRupee,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [tourists, setTourists] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState("Last 6 months");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [touristsRes, bookingsRes, packagesRes] =
          await Promise.all([
            axios.get(`${API}/tourists`),
            axios.get(`${API}/bookings`),
            axios.get(`${API}/packages`),
          ]);

        setTourists(touristsRes.data);
        setBookings(bookingsRes.data);
        setPackages(packagesRes.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ---------------------------------------------------------
  // Map Oracle rows
  // ---------------------------------------------------------

  const packageMap = useMemo(() => {
    const map = {};

    packages.forEach((row) => {
      map[row[0]] = {
        id: row[0],
        name: row[1],
        city: row[2],
        state: row[3],
        country: row[4],
        duration: row[5],
        price: Number(row[6]) || 0,
        type: row[7],
        guideId: row[8],
      };
    });

    return map;
  }, [packages]);

  const bookingData = useMemo(() => {
    return bookings.map((row) => ({
      id: row[0],
      touristId: row[1],
      packageId: row[2],
      bookingDate: row[3],
      travelDate: row[4],
      numberOfPeople: Number(row[5]) || 0,
      paymentStatus: row[6],
      totalAmount: Number(row[7]) || 0,
    }));
  }, [bookings]);

  // ---------------------------------------------------------
  // Dashboard statistics
  // ---------------------------------------------------------

  const totalTourists = tourists.length;

  const activeBookings = bookingData.filter(
    (booking) => booking.paymentStatus !== "Cancelled"
  ).length;

  const totalRevenue = bookingData
    .filter((booking) => booking.paymentStatus !== "Cancelled")
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const destinationCount = new Set(
    packages.map((pkg) => pkg[2]).filter(Boolean)
  ).size;

  // ---------------------------------------------------------
  // Revenue chart
  // ---------------------------------------------------------

  const revenueMonths = useMemo(() => {
    const monthCount = chartRange === "Last 12 months" ? 12 : 6;

    const months = [];

    const now = new Date();

    for (let i = monthCount - 1; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleString("en-US", {
          month: "short",
        }),
        revenue: 0,
      });
    }

    bookingData.forEach((booking) => {
      if (
        booking.paymentStatus === "Cancelled" ||
        !booking.bookingDate
      ) {
        return;
      }

      const date = new Date(booking.bookingDate);

      const month = months.find(
        (item) =>
          item.year === date.getFullYear() &&
          item.month === date.getMonth()
      );

      if (month) {
        month.revenue += booking.totalAmount;
      }
    });

    const maxRevenue = Math.max(
      ...months.map((month) => month.revenue),
      1
    );

    return months.map((month) => ({
      ...month,
      percentage: (month.revenue / maxRevenue) * 100,
    }));
  }, [bookingData, chartRange]);

  // ---------------------------------------------------------
  // Popular destinations
  // ---------------------------------------------------------

  const popularDestinations = useMemo(() => {
    const counts = {};

    bookingData.forEach((booking) => {
      if (booking.paymentStatus === "Cancelled") return;

      const pkg = packageMap[booking.packageId];

      if (!pkg || !pkg.city) return;

      counts[pkg.city] =
        (counts[pkg.city] || 0) + booking.numberOfPeople;
    });

    const sorted = Object.entries(counts)
      .map(([name, bookings]) => ({
        name,
        bookings,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 4);

    const maxBookings = sorted[0]?.bookings || 1;

    return sorted.map((destination) => ({
      ...destination,
      percentage:
        (destination.bookings / maxBookings) * 100,
    }));
  }, [bookingData, packageMap]);

  // ---------------------------------------------------------
  // Formatting helpers
  // ---------------------------------------------------------

  const formatRevenue = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }

    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const stats = [
    {
      label: "Total Tourists",
      value: loading ? "—" : totalTourists.toLocaleString("en-IN"),
      icon: Users,
    },
    {
      label: "Active Bookings",
      value: loading ? "—" : activeBookings.toLocaleString("en-IN"),
      icon: CalendarCheck,
    },
    {
      label: "Total Revenue",
      value: loading ? "—" : formatRevenue(totalRevenue),
      icon: IndianRupee,
    },
    {
      label: "Destinations",
      value: loading ? "—" : destinationCount.toLocaleString("en-IN"),
      icon: MapPin,
    },
  ];

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

              <div className="flex items-center gap-1 mt-4 text-xs text-[#99958E]">
                Live database data
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

            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="text-xs border border-[#E6E1D8] rounded-lg px-3 py-2 bg-white text-[#77736D] outline-none"
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          {loading ? (
            <div className="h-56 flex items-center justify-center text-sm text-[#99958E]">
              Loading revenue data...
            </div>
          ) : (
            <div className="h-56 flex items-end gap-5 px-4">
              {revenueMonths.map((month) => (
                <div
                  key={`${month.year}-${month.month}`}
                  className="flex-1 flex flex-col justify-end items-center gap-3 h-full"
                >
                  <div className="w-full flex-1 flex items-end justify-center">
                    <div
                      title={`${month.label}: ${formatRevenue(
                        month.revenue
                      )}`}
                      className="w-full max-w-12 bg-[#D8CFC1] rounded-t-md hover:bg-[#8B7355] transition"
                      style={{
                        height:
                          month.revenue === 0
                            ? "3px"
                            : `${Math.max(
                                month.percentage,
                                8
                              )}%`,
                      }}
                    />
                  </div>

                  <span className="text-[11px] text-[#99958E]">
                    {month.label}
                  </span>
                </div>
              ))}
            </div>
          )}
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

          {loading ? (
            <div className="text-sm text-[#99958E]">
              Loading destinations...
            </div>
          ) : popularDestinations.length === 0 ? (
            <div className="text-sm text-[#99958E]">
              No booking data available.
            </div>
          ) : (
            <div className="space-y-6">
              {popularDestinations.map((destination) => (
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
          )}

          <button
            onClick={() => navigate("/destinations")}
            className="flex items-center gap-2 text-xs text-[#8B7355] mt-8 hover:text-[#1C1C1C] transition"
          >
            View all destinations
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
