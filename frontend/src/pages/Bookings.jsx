import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  CalendarDays,
  Users,
  MapPin,
} from "lucide-react";

const API = "http://localhost:5000/api";

const paymentStyles = {
  Paid: "bg-[#EEF2EB] text-[#52614B]",
  Pending: "bg-[#F5EEE4] text-[#8B7355]",
  Partial: "bg-[#F5EEE4] text-[#8B7355]",
  Cancelled: "bg-[#F3E8E8] text-[#8B5C5C]",
};

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount) {
  if (amount === null || amount === undefined) return "₹0";

  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Status");
  const [sortOption, setSortOption] = useState("Booking ID");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [bookingResponse, touristResponse, packageResponse] =
        await Promise.all([
          axios.get(`${API}/bookings`),
          axios.get(`${API}/tourists`),
          axios.get(`${API}/packages`),
        ]);

      setBookings(bookingResponse.data);
      setTourists(touristResponse.data);
      setPackages(packageResponse.data);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Unable to load booking data.");
    } finally {
      setLoading(false);
    }
  }

  const touristMap = useMemo(() => {
    const map = {};

    tourists.forEach((tourist) => {
      const fullName = [tourist[1], tourist[2], tourist[3]]
        .filter(Boolean)
        .join(" ");

      map[tourist[0]] = fullName || `Tourist #${tourist[0]}`;
    });

    return map;
  }, [tourists]);

  const packageMap = useMemo(() => {
    const map = {};

    packages.forEach((pkg) => {
      map[pkg[0]] = {
        name: pkg[1],
        destination: [pkg[2], pkg[3], pkg[4]]
          .filter(Boolean)
          .join(", "),
      };
    });

    return map;
  }, [packages]);

  const bookingData = useMemo(() => {
    return bookings.map((booking) => {
      const bookingId = booking[0];
      const touristId = booking[1];
      const packageId = booking[2];
      const bookingDate = booking[3];
      const travelDate = booking[4];
      const people = booking[5];
      const paymentStatus = booking[6];
      const totalAmount = booking[7];

      const packageInfo = packageMap[packageId];

      return {
        id: bookingId,
        touristId,
        tourist:
          touristMap[touristId] || `Tourist #${touristId}`,
        packageId,
        package: packageInfo?.name || `Package #${packageId}`,
        destination: packageInfo?.destination || "—",
        bookingDate,
        travelDate,
        people,
        amount: totalAmount,
        paymentStatus,
      };
    });
  }, [bookings, touristMap, packageMap]);

  const filteredBookings = useMemo(() => {
    let result = [...bookingData];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((booking) => {
        return (
          String(booking.id).toLowerCase().includes(query) ||
          booking.tourist.toLowerCase().includes(query) ||
          booking.package.toLowerCase().includes(query) ||
          booking.destination.toLowerCase().includes(query)
        );
      });
    }

    if (paymentFilter !== "All Payment Status") {
      result = result.filter(
        (booking) => booking.paymentStatus === paymentFilter
      );
    }

    result.sort((a, b) => {
      if (sortOption === "Newest first") {
        return (
          new Date(b.bookingDate).getTime() -
          new Date(a.bookingDate).getTime()
        );
      }

      if (sortOption === "Oldest first") {
        return (
          new Date(a.bookingDate).getTime() -
          new Date(b.bookingDate).getTime()
        );
      }

      if (sortOption === "Highest amount") {
        return Number(b.amount || 0) - Number(a.amount || 0);
      }

      if (sortOption === "Lowest amount") {
        return Number(a.amount || 0) - Number(b.amount || 0);
      }

      return 0;
    });

    return result;
  }, [bookingData, search, paymentFilter, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, paymentFilter, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / itemsPerPage)
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalBookings = bookingData.length;

  const upcomingTrips = bookingData.filter((booking) => {
    if (!booking.travelDate) return false;

    const travelDate = new Date(booking.travelDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return travelDate >= today && booking.paymentStatus !== "Cancelled";
  }).length;

  const bookingRevenue = bookingData.reduce(
    (total, booking) => total + Number(booking.amount || 0),
    0
  );

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#8B7355]">
            Booking Management
          </p>

          <h1 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
            Bookings
          </h1>

          <p className="mt-2 text-sm text-[#77736D]">
            Manage tourist reservations, travel dates and payments.
          </p>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333]"
          onClick={() => {
            // Add Booking form will be connected in the CRUD step.
          }}
        >
          <Plus size={17} />
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99958E]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID, tourist or package..."
            className="w-full border border-[#E6E1D8] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#AAA59D] focus:border-[#8B7355]"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]"
        >
          <option>All Payment Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Partial</option>
          <option>Cancelled</option>
        </select>

        <button
          className="flex items-center justify-center gap-2 border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] hover:bg-[#F7F5F0]"
          onClick={() => setSortOption("Newest first")}
        >
          <CalendarDays size={17} />
          Travel Date
        </button>

        <button className="flex items-center justify-center gap-2 border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] hover:bg-[#F7F5F0]">
          <SlidersHorizontal size={17} />
          Filters
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-[#E6E1D8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
            Total Bookings
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
            {totalBookings}
          </p>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
            Upcoming Trips
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
            {upcomingTrips}
          </p>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
            Booking Revenue
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
            {formatAmount(bookingRevenue)}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-[#E6E1D8] bg-white p-4 text-sm text-[#8B5C5C]">
          {error}
        </div>
      )}

      {/* Table header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#77736D]">
          Showing{" "}
          <span className="font-semibold text-[#1C1C1C]">
            {filteredBookings.length}
          </span>{" "}
          bookings
        </p>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border-none bg-transparent text-sm text-[#77736D] outline-none"
        >
          <option>Newest first</option>
          <option>Oldest first</option>
          <option>Highest amount</option>
          <option>Lowest amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-[#E6E1D8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#E6E1D8] bg-[#FAF9F6]">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Booking
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Tourist
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Package
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Destination
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Travel Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  People
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Total Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Payment
                </th>

                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-sm text-[#99958E]"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-sm text-[#99958E]"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-[#EEEAE3] last:border-b-0 hover:bg-[#FCFBF9]"
                  >
                    {/* Booking */}
                    <td className="px-6 py-5">
                      <p className="font-mono text-sm font-semibold text-[#1C1C1C]">
                        BK-{booking.id}
                      </p>

                      <p className="mt-1 text-xs text-[#99958E]">
                        Booked {formatDate(booking.bookingDate)}
                      </p>
                    </td>

                    {/* Tourist */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-[#1C1C1C]">
                        {booking.tourist}
                      </p>
                    </td>

                    {/* Package */}
                    <td className="px-6 py-5">
                      <p className="text-sm text-[#55514B]">
                        {booking.package}
                      </p>
                    </td>

                    {/* Destination */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-[#8B7355]" />

                        <span className="text-sm text-[#77736D]">
                          {booking.destination}
                        </span>
                      </div>
                    </td>

                    {/* Travel Date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="text-[#8B7355]"
                        />

                        <span className="text-sm text-[#55514B]">
                          {formatDate(booking.travelDate)}
                        </span>
                      </div>
                    </td>

                    {/* People */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Users size={15} className="text-[#99958E]" />

                        <span className="text-sm text-[#55514B]">
                          {booking.people}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-[#1C1C1C]">
                        {formatAmount(booking.amount)}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1.5 text-xs font-medium ${
                          paymentStyles[booking.paymentStatus] ||
                          "bg-[#F2F0EB] text-[#55514B]"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <button className="p-2 text-[#77736D] hover:bg-[#F2F0EB] hover:text-[#1C1C1C]">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#E6E1D8] px-6 py-4">
          <p className="text-xs text-[#99958E]">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`border border-[#E6E1D8] px-3 py-2 text-xs ${
                currentPage === 1
                  ? "text-[#BBB7B0]"
                  : "text-[#55514B] hover:bg-[#F7F5F0]"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={
                    page === currentPage
                      ? "border border-[#1C1C1C] bg-[#1C1C1C] px-3 py-2 text-xs text-white"
                      : "border border-[#E6E1D8] px-3 py-2 text-xs text-[#55514B] hover:bg-[#F7F5F0]"
                  }
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`border border-[#E6E1D8] px-3 py-2 text-xs ${
                currentPage === totalPages
                  ? "text-[#BBB7B0]"
                  : "text-[#55514B] hover:bg-[#F7F5F0]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;
