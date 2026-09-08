import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  CreditCard,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

const API = "http://localhost:5000/api";

const statusStyles = {
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

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("traveliaUser") || "null");
  } catch {
    return null;
  }
}

function Payments() {
  const [bookings, setBookings] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] =
    useState("All Payment Status");

  const [openMenu, setOpenMenu] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const [currentUser] = useState(getStoredUser);
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [
        bookingResponse,
        touristResponse,
        packageResponse,
      ] = await Promise.all([
        axios.get(`${API}/bookings`),
        axios.get(`${API}/tourists`),
        axios.get(`${API}/packages`),
      ]);

      setBookings(bookingResponse.data);
      setTourists(touristResponse.data);
      setPackages(packageResponse.data);
    } catch (err) {
      console.error("Error loading payment data:", err);
      setError("Unable to load payment data.");
    } finally {
      setLoading(false);
    }
  }

  const touristMap = useMemo(() => {
    const map = {};

    tourists.forEach((tourist) => {
      const fullName = [
        tourist[1],
        tourist[2],
        tourist[3],
      ]
        .filter(Boolean)
        .join(" ");

      map[tourist[0]] =
        fullName || `Tourist #${tourist[0]}`;
    });

    return map;
  }, [tourists]);

  const packageMap = useMemo(() => {
    const map = {};

    packages.forEach((pkg) => {
      map[pkg[0]] = pkg[1];
    });

    return map;
  }, [packages]);

  const payments = useMemo(() => {
    return bookings.map((booking) => ({
      bookingId: booking[0],
      touristId: booking[1],
      packageId: booking[2],
      tourist:
        touristMap[booking[1]] ||
        `Tourist #${booking[1]}`,
      package:
        packageMap[booking[2]] ||
        `Package #${booking[2]}`,
      date: booking[3],
      amount: Number(booking[7] || 0),
      status: booking[6],
    }));
  }, [bookings, touristMap, packageMap]);

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((payment) => {
        return (
          String(payment.bookingId)
            .toLowerCase()
            .includes(query) ||
          payment.tourist
            .toLowerCase()
            .includes(query) ||
          payment.package
            .toLowerCase()
            .includes(query)
        );
      });
    }

    if (paymentFilter !== "All Payment Status") {
      result = result.filter(
        (payment) =>
          payment.status === paymentFilter
      );
    }

    result.sort(
      (a, b) =>
        Number(a.bookingId) - Number(b.bookingId)
    );

    return result;
  }, [payments, search, paymentFilter]);

  const totalRevenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

  async function handleUpdateStatus(payment, newStatus) {
    // RBAC protection
    if (!isAdmin) return;

    try {
      setUpdatingStatus(payment.bookingId);
      setError("");
      setOpenMenu(null);

      const booking = bookings.find(
        (item) => item[0] === payment.bookingId
      );

      if (!booking) {
        setError("Booking could not be found.");
        return;
      }

      await axios.put(
        `${API}/bookings/${payment.bookingId}`,
        {
          touristId: booking[1],
          packageId: booking[2],
          bookingDate: formatDateForApi(booking[3]),
          travelDate: formatDateForApi(booking[4]),
          numberOfPeople: booking[5],
          paymentStatus: newStatus,
          totalAmount: booking[7],
        }
      );

      await fetchData();
    } catch (err) {
      console.error(
        "Error updating payment status:",
        err
      );

      const message =
        err.response?.data?.error ||
        "Unable to update payment status.";

      setError(message);
    } finally {
      setUpdatingStatus(null);
    }
  }

  function formatDateForApi(dateValue) {
    if (!dateValue) return "";

    if (typeof dateValue === "string") {
      if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
        return dateValue.slice(0, 10);
      }

      const oracleMatch = dateValue.match(
        /^(\d{2})-([A-Z]{3})-(\d{2}|\d{4})$/i
      );

      if (oracleMatch) {
        const [
          ,
          day,
          monthText,
          yearText,
        ] = oracleMatch;

        const months = {
          JAN: "01",
          FEB: "02",
          MAR: "03",
          APR: "04",
          MAY: "05",
          JUN: "06",
          JUL: "07",
          AUG: "08",
          SEP: "09",
          OCT: "10",
          NOV: "11",
          DEC: "12",
        };

        const month =
          months[monthText.toUpperCase()];

        let year = yearText;

        if (year.length === 2) {
          year =
            Number(year) >= 50
              ? `19${year}`
              : `20${year}`;
        }

        if (month) {
          return `${year}-${month}-${day}`;
        }
      }
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <div
      className="space-y-8"
      onClick={() => setOpenMenu(null)}
    >
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

      {/* Error */}
      {error && (
        <div className="border border-[#E6CFCF] bg-[#FDF5F5] px-4 py-3 text-sm text-[#8B5C5C]">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Revenue */}
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Total Revenue
              </p>

              <p className="mt-3 text-2xl font-semibold text-[#1C1C1C]">
                {formatAmount(totalRevenue)}
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

        {/* Paid Amount */}
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Paid Amount
              </p>

              <p className="mt-3 text-2xl font-semibold text-[#1C1C1C]">
                {formatAmount(paidAmount)}
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

        {/* Pending Amount */}
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Pending Amount
              </p>

              <p className="mt-3 text-2xl font-semibold text-[#1C1C1C]">
                {formatAmount(pendingAmount)}
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
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search booking ID, tourist or package..."
            className="w-full border border-[#E6E1D8] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#AAA59D] focus:border-[#8B7355]"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) =>
            setPaymentFilter(e.target.value)
          }
          className="border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]"
        >
          <option>All Payment Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Partial</option>
          <option>Cancelled</option>
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
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-[#99958E]"
                  >
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-[#99958E]"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.bookingId}
                    className="border-b border-[#EEEAE3] last:border-b-0 hover:bg-[#FCFBF9]"
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm font-semibold text-[#1C1C1C]">
                        BK-{payment.bookingId}
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
                        {formatDate(payment.date)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-[#1C1C1C]">
                        {formatAmount(payment.amount)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1.5 text-xs font-medium ${
                          statusStyles[payment.status] ||
                          "bg-[#F2F0EB] text-[#55514B]"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    {/* Admin-only actions */}
                    <td className="relative px-6 py-5">
                      {isAdmin && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setOpenMenu(
                                openMenu ===
                                  payment.bookingId
                                  ? null
                                  : payment.bookingId
                              );
                            }}
                            disabled={
                              updatingStatus ===
                              payment.bookingId
                            }
                            className="p-2 text-[#77736D] hover:bg-[#F2F0EB] hover:text-[#1C1C1C] disabled:opacity-50"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenu === payment.bookingId && (
                            <div
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              className="absolute right-6 top-14 z-20 w-48 border border-[#E6E1D8] bg-white py-2 shadow-lg"
                            >
                              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#99958E]">
                                Update Status
                              </p>

                              {[
                                "Paid",
                                "Pending",
                                "Partial",
                                "Cancelled",
                              ].map((status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleUpdateStatus(
                                      payment,
                                      status
                                    )
                                  }
                                  disabled={
                                    payment.status ===
                                    status
                                  }
                                  className={`block w-full px-4 py-2.5 text-left text-sm transition ${
                                    payment.status ===
                                    status
                                      ? "cursor-default bg-[#F7F5F0] font-medium text-[#8B7355]"
                                      : "text-[#55514B] hover:bg-[#FAF9F6] hover:text-[#1C1C1C]"
                                  }`}
                                >
                                  {status}

                                  {payment.status ===
                                    status && "  ✓"}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E6E1D8] px-6 py-4">
          <p className="text-xs text-[#99958E]">
            Showing {filteredPayments.length} payments
          </p>

          <span className="text-xs text-[#99958E]">
            Data from BOOKING
          </span>
        </div>
      </div>
    </div>
  );
}

export default Payments;
