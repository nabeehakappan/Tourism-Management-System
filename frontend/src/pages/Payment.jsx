import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  CreditCard,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

const payments = [
  {
    bookingId: "BK-1001",
    tourist: "Aarav Mehta",
    package: "Kerala Escape",
    date: "Sep 01, 2026",
    amount: "₹24,500",
    status: "Paid",
  },
  {
    bookingId: "BK-1002",
    tourist: "Diya Sharma",
    package: "Goa Getaway",
    date: "Aug 29, 2026",
    amount: "₹32,800",
    status: "Paid",
  },
  {
    bookingId: "BK-1003",
    tourist: "Rohan Nair",
    package: "Royal Rajasthan",
    date: "Aug 27, 2026",
    amount: "₹28,400",
    status: "Pending",
  },
  {
    bookingId: "BK-1004",
    tourist: "Ananya Rao",
    package: "Himalayan Retreat",
    date: "Aug 24, 2026",
    amount: "₹46,200",
    status: "Paid",
  },
  {
    bookingId: "BK-1005",
    tourist: "Kabir Kapoor",
    package: "Backwaters Bliss",
    date: "Aug 22, 2026",
    amount: "₹21,600",
    status: "Paid",
  },
  {
    bookingId: "BK-1006",
    tourist: "Meera Iyer",
    package: "Golden Triangle",
    date: "Aug 20, 2026",
    amount: "₹35,700",
    status: "Pending",
  },
];

const statusStyles = {
  Paid: "bg-[#EEF2EB] text-[#52614B]",
  Pending: "bg-[#F5EEE4] text-[#8B7355]",
};

function Payments() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="mb-2 text-sm font-medium text-[#8B7355]">
          Financial Overview
        </p>

        <h1 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
          Payments
        </h1>

        <p className="mt-2 text-sm text-[#77736D]">
          Track booking payments and overall revenue.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Total Revenue
              </p>

              <p className="mt-3 text-2xl font-semibold text-[#1C1C1C]">
                ₹8.42L
              </p>

              <p className="mt-2 text-xs text-[#77736D]">
                Across all bookings
              </p>
            </div>

            <div className="bg-[#F3EFE8] p-3 text-[#8B7355]">
              <IndianRupee size={20} />
            </div>
          </div>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Paid Amount
              </p>

              <p className="mt-3 text-2xl font-semibold text-[#1C1C1C]">
                ₹7.16L
              </p>

              <p className="mt-2 text-xs text-[#77736D]">
                Successfully received
              </p>
            </div>

            <div className="bg-[#EEF2EB] p-3 text-[#52614B]">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Pending Amount
              </p>

              <p className="mt-3 text-2xl font-semibold text-[#1C1C1C]">
                ₹1.26L
              </p>

              <p className="mt-2 text-xs text-[#77736D]">
                Awaiting payment
              </p>
            </div>

            <div className="bg-[#F5EEE4] p-3 text-[#8B7355]">
              <Clock3 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
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
          <SlidersHorizontal size={17} />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-[#E6E1D8] bg-white">
        <div className="border-b border-[#E6E1D8] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-[#F3EFE8] p-2 text-[#8B7355]">
              <CreditCard size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#1C1C1C]">
                Booking Payments
              </h2>

              <p className="mt-1 text-xs text-[#99958E]">
                Payment status linked to each booking
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E6E1D8] bg-[#FAF9F6]">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Booking ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Tourist
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Package
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Booking Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                  Payment Status
                </th>

                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.bookingId}
                  className="border-b border-[#EEEAE3] last:border-b-0 hover:bg-[#FCFBF9]"
                >
                  <td className="px-6 py-5">
                    <span className="font-mono text-sm font-semibold text-[#1C1C1C]">
                      {payment.bookingId}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-[#1C1C1C]">
                      {payment.tourist}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm text-[#55514B]">
                      {payment.package}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm text-[#77736D]">
                      {payment.date}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-[#1C1C1C]">
                      {payment.amount}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-1.5 text-xs font-medium ${
                        statusStyles[payment.status]
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

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

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E6E1D8] px-6 py-4">
          <p className="text-xs text-[#99958E]">
            Showing 6 recent payments
          </p>

          <button className="text-xs font-medium text-[#8B7355] hover:text-[#1C1C1C]">
            View all payments →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payments;