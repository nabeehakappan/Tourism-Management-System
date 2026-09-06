import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  CalendarDays,
  Users,
  MapPin,
} from "lucide-react";

const bookings = [
  {
    id: "BK-1001",
    tourist: "Aarav Mehta",
    package: "Kerala Escape",
    destination: "Munnar, Kerala",
    bookingDate: "Sep 01, 2026",
    travelDate: "Sep 05, 2026",
    people: 2,
    amount: "₹24,500",
    paymentStatus: "Paid",
  },
  {
    id: "BK-1002",
    tourist: "Diya Sharma",
    package: "Goa Getaway",
    destination: "Goa",
    bookingDate: "Aug 29, 2026",
    travelDate: "Sep 04, 2026",
    people: 3,
    amount: "₹32,800",
    paymentStatus: "Paid",
  },
  {
    id: "BK-1003",
    tourist: "Rohan Nair",
    package: "Royal Rajasthan",
    destination: "Jaipur, Rajasthan",
    bookingDate: "Aug 27, 2026",
    travelDate: "Sep 02, 2026",
    people: 2,
    amount: "₹28,400",
    paymentStatus: "Pending",
  },
  {
    id: "BK-1004",
    tourist: "Ananya Rao",
    package: "Himalayan Retreat",
    destination: "Manali, Himachal Pradesh",
    bookingDate: "Aug 24, 2026",
    travelDate: "Aug 30, 2026",
    people: 4,
    amount: "₹46,200",
    paymentStatus: "Paid",
  },
  {
    id: "BK-1005",
    tourist: "Kabir Kapoor",
    package: "Backwaters Bliss",
    destination: "Alleppey, Kerala",
    bookingDate: "Aug 22, 2026",
    travelDate: "Aug 28, 2026",
    people: 2,
    amount: "₹21,600",
    paymentStatus: "Paid",
  },
  {
    id: "BK-1006",
    tourist: "Meera Iyer",
    package: "Golden Triangle",
    destination: "Delhi, India",
    bookingDate: "Aug 20, 2026",
    travelDate: "Aug 26, 2026",
    people: 3,
    amount: "₹35,700",
    paymentStatus: "Pending",
  },
];

const paymentStyles = {
  Paid: "bg-[#EEF2EB] text-[#52614B]",
  Pending: "bg-[#F5EEE4] text-[#8B7355]",
};

function Bookings() {
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

        <button className="flex items-center justify-center gap-2 bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333]">
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
            placeholder="Search booking ID, tourist or package..."
            className="w-full border border-[#E6E1D8] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#AAA59D] focus:border-[#8B7355]"
          />
        </div>

        <select className="border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]">
          <option>All Payment Status</option>
          <option>Paid</option>
          <option>Pending</option>
        </select>

        <button className="flex items-center justify-center gap-2 border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] hover:bg-[#F7F5F0]">
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
            126
          </p>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
            Upcoming Trips
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
            48
          </p>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
            Booking Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
            ₹8.42L
          </p>
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#77736D]">
          Showing{" "}
          <span className="font-semibold text-[#1C1C1C]">
            {bookings.length}
          </span>{" "}
          recent bookings
        </p>

        <select className="border-none bg-transparent text-sm text-[#77736D] outline-none">
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
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-[#EEEAE3] last:border-b-0 hover:bg-[#FCFBF9]"
                >
                  {/* Booking ID + Booking Date */}
                  <td className="px-6 py-5">
                    <p className="font-mono text-sm font-semibold text-[#1C1C1C]">
                      {booking.id}
                    </p>

                    <p className="mt-1 text-xs text-[#99958E]">
                      Booked {booking.bookingDate}
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
                        {booking.travelDate}
                      </span>
                    </div>
                  </td>

                  {/* Number of People */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-[#99958E]" />

                      <span className="text-sm text-[#55514B]">
                        {booking.people}
                      </span>
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-[#1C1C1C]">
                      {booking.amount}
                    </span>
                  </td>

                  {/* Payment Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-1.5 text-xs font-medium ${
                        paymentStyles[booking.paymentStatus]
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#E6E1D8] px-6 py-4">
          <p className="text-xs text-[#99958E]">
            Page 1 of 18
          </p>

          <div className="flex gap-2">
            <button
              disabled
              className="border border-[#E6E1D8] px-3 py-2 text-xs text-[#BBB7B0]"
            >
              Previous
            </button>

            <button className="border border-[#1C1C1C] bg-[#1C1C1C] px-3 py-2 text-xs text-white">
              1
            </button>

            <button className="border border-[#E6E1D8] px-3 py-2 text-xs text-[#55514B] hover:bg-[#F7F5F0]">
              2
            </button>

            <button className="border border-[#E6E1D8] px-3 py-2 text-xs text-[#55514B] hover:bg-[#F7F5F0]">
              3
            </button>

            <button className="border border-[#E6E1D8] px-3 py-2 text-xs text-[#55514B] hover:bg-[#F7F5F0]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;