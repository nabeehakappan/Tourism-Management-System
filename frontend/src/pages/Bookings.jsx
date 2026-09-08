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
  X,
  Pencil,
  Trash2,
} from "lucide-react";

const API = "http://localhost:5000/api";

const paymentStyles = {
  Paid: "bg-[#EEF2EB] text-[#52614B]",
  Pending: "bg-[#F5EEE4] text-[#8B7355]",
  Partial: "bg-[#F5EEE4] text-[#8B7355]",
  Cancelled: "bg-[#F3E8E8] text-[#8B5C5C]",
};

const emptyForm = {
  bookingId: "",
  touristId: "",
  packageId: "",
  bookingDate: "",
  travelDate: "",
  numberOfPeople: 1,
  paymentStatus: "Pending",
  totalAmount: "",
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("traveliaUser") || "null");
  } catch {
    return null;
  }
}

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

function formatDateForInput(dateValue) {
  if (!dateValue) return "";

  if (typeof dateValue === "string") {
    const isoMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    const oracleMatch = dateValue.match(
      /^(\d{2})-([A-Za-z]{3})-(\d{2}|\d{4})$/
    );

    if (oracleMatch) {
      const [, day, monthText, yearText] = oracleMatch;

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

      const month = months[monthText.toUpperCase()];

      if (month) {
        const year =
          yearText.length === 2
            ? `20${yearText}`
            : yearText;

        return `${year}-${month}-${day}`;
      }
    }
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatAmount(amount) {
  if (amount === null || amount === undefined) {
    return "₹0";
  }

  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [tourists, setTourists] = useState([]);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] =
    useState("All Payment Status");
  const [sortOption, setSortOption] =
    useState("Booking ID");

  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editingBooking, setEditingBooking] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  const itemsPerPage = 5;

  // =========================
  // RBAC
  // =========================

  const [currentUser] = useState(getStoredUser);

  const isAdmin = currentUser?.role === "ADMIN";

  // =========================
  // FETCH DATA
  // =========================

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
      console.error("Error loading bookings:", err);
      setError("Unable to load booking data.");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // MAP TOURISTS
  // =========================

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

  // =========================
  // MAP PACKAGES
  // =========================

  const packageMap = useMemo(() => {
    const map = {};

    packages.forEach((pkg) => {
      map[pkg[0]] = {
        name: pkg[1],
        destination: [
          pkg[2],
          pkg[3],
          pkg[4],
        ]
          .filter(Boolean)
          .join(", "),
        price: Number(pkg[6] || 0),
      };
    });

    return map;
  }, [packages]);

  // =========================
  // BOOKING DATA
  // =========================

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
          touristMap[touristId] ||
          `Tourist #${touristId}`,

        packageId,

        package:
          packageInfo?.name ||
          `Package #${packageId}`,

        destination:
          packageInfo?.destination || "—",

        bookingDate,
        travelDate,

        people,

        amount: totalAmount,

        paymentStatus,
      };
    });
  }, [bookings, touristMap, packageMap]);

  // =========================
  // SEARCH + FILTER + SORT
  // =========================

  const filteredBookings = useMemo(() => {
    let result = [...bookingData];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((booking) => {
        return (
          String(booking.id)
            .toLowerCase()
            .includes(query) ||
          booking.tourist
            .toLowerCase()
            .includes(query) ||
          booking.package
            .toLowerCase()
            .includes(query) ||
          booking.destination
            .toLowerCase()
            .includes(query)
        );
      });
    }

    if (paymentFilter !== "All Payment Status") {
      result = result.filter(
        (booking) =>
          booking.paymentStatus === paymentFilter
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
        return (
          Number(b.amount || 0) -
          Number(a.amount || 0)
        );
      }

      if (sortOption === "Lowest amount") {
        return (
          Number(a.amount || 0) -
          Number(b.amount || 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    bookingData,
    search,
    paymentFilter,
    sortOption,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, paymentFilter, sortOption]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBookings.length / itemsPerPage
    )
  );

  const paginatedBookings =
    filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  // =========================
  // SUMMARY
  // =========================

  const totalBookings = bookingData.length;

  const upcomingTrips = bookingData.filter(
    (booking) => {
      if (!booking.travelDate) return false;

      const travelDate = new Date(
        booking.travelDate
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return (
        travelDate >= today &&
        booking.paymentStatus !== "Cancelled"
      );
    }
  ).length;

  const bookingRevenue = bookingData.reduce(
    (total, booking) =>
      total + Number(booking.amount || 0),
    0
  );

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  }

  // =========================
  // FORM HANDLERS
  // =========================

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  }

  function handlePackageChange(event) {
    const packageId = event.target.value;

    const selectedPackage = packageMap[packageId];

    setForm((previous) => ({
      ...previous,
      packageId,

      totalAmount: selectedPackage
        ? String(
            selectedPackage.price *
              Number(previous.numberOfPeople || 1)
          )
        : "",
    }));

    setFormError("");
  }

  function handlePeopleChange(event) {
    const numberOfPeople = event.target.value;

    const selectedPackage =
      packageMap[form.packageId];

    setForm((previous) => ({
      ...previous,
      numberOfPeople,

      totalAmount: selectedPackage
        ? String(
            selectedPackage.price *
              Number(numberOfPeople || 1)
          )
        : previous.totalAmount,
    }));

    setFormError("");
  }

  // =========================
  // ADD BOOKING
  // =========================

  async function handleAddBooking(event) {
    event.preventDefault();

    if (!isAdmin) return;

    if (
      !form.bookingId ||
      !form.touristId ||
      !form.packageId ||
      !form.bookingDate ||
      !form.travelDate ||
      !form.numberOfPeople ||
      !form.totalAmount
    ) {
      setFormError(
        "Please fill in all required fields."
      );

      return;
    }

    if (
      new Date(form.travelDate) <
      new Date(form.bookingDate)
    ) {
      setFormError(
        "Travel date cannot be before the booking date."
      );

      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await axios.post(`${API}/bookings`, {
        bookingId: Number(form.bookingId),
        touristId: Number(form.touristId),
        packageId: Number(form.packageId),
        bookingDate: form.bookingDate,
        travelDate: form.travelDate,
        numberOfPeople: Number(
          form.numberOfPeople
        ),
        paymentStatus: form.paymentStatus,
        totalAmount: Number(form.totalAmount),
      });

      await fetchData();

      setForm(emptyForm);
      setShowAddModal(false);
    } catch (err) {
      console.error(
        "Error adding booking:",
        err
      );

      setFormError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to add booking."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // EDIT BOOKING
  // =========================

  function handleEditBooking(booking) {
    if (!isAdmin) return;

    setEditingBooking(booking);

    setForm({
      bookingId: booking.id,

      touristId: booking.touristId,

      packageId: booking.packageId,

      bookingDate: formatDateForInput(
        booking.bookingDate
      ),

      travelDate: formatDateForInput(
        booking.travelDate
      ),

      numberOfPeople: booking.people,

      paymentStatus: booking.paymentStatus,

      totalAmount: String(
        booking.amount ?? ""
      ),
    });

    setFormError("");
    setOpenMenu(null);
    setShowEditModal(true);
  }

  // =========================
  // UPDATE BOOKING
  // =========================

  async function handleUpdateBooking(event) {
    event.preventDefault();

    if (!isAdmin || !editingBooking) return;

    if (
      !form.touristId ||
      !form.packageId ||
      !form.bookingDate ||
      !form.travelDate ||
      !form.numberOfPeople ||
      form.totalAmount === ""
    ) {
      setFormError(
        "Please fill in all required fields."
      );

      return;
    }

    if (Number(form.numberOfPeople) < 1) {
      setFormError(
        "Number of people must be at least 1."
      );

      return;
    }

    if (Number(form.totalAmount) < 0) {
      setFormError(
        "Total amount cannot be negative."
      );

      return;
    }

    if (
      new Date(form.travelDate) <
      new Date(form.bookingDate)
    ) {
      setFormError(
        "Travel date cannot be before the booking date."
      );

      return;
    }

    try {
      setSaving(true);
      setFormError("");

      await axios.put(
        `${API}/bookings/${editingBooking.id}`,
        {
          touristId: Number(form.touristId),
          packageId: Number(form.packageId),
          bookingDate: form.bookingDate,
          travelDate: form.travelDate,
          numberOfPeople: Number(
            form.numberOfPeople
          ),
          paymentStatus: form.paymentStatus,
          totalAmount: Number(form.totalAmount),
        }
      );

      await fetchData();

      setForm(emptyForm);
      setEditingBooking(null);
      setShowEditModal(false);
    } catch (err) {
      console.error(
        "Error updating booking:",
        err
      );

      setFormError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update booking."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // DELETE / CANCEL BOOKING
  // =========================

  async function handleDeleteBooking(booking) {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking BK-${booking.id}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await axios.delete(
        `${API}/bookings/${booking.id}`
      );

      await fetchData();

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "Error cancelling booking:",
        err
      );

      const backendError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "";

      if (
        backendError.includes("ORA-02292") ||
        backendError.includes(
          "integrity constraint"
        )
      ) {
        setError(
          "This booking cannot be deleted because it has related special requests. Remove those requests first."
        );
      } else {
        setError(
          backendError ||
            "Failed to cancel booking."
        );
      }
    }
  }

  // =========================
  // MODALS
  // =========================

  function openNewBookingModal() {
    if (!isAdmin) return;

    setForm(emptyForm);
    setFormError("");
    setEditingBooking(null);
    setShowAddModal(true);
  }

  function closeAddModal() {
    setShowAddModal(false);
    setForm(emptyForm);
    setFormError("");
  }

  function closeEditModal() {
    setShowEditModal(false);
    setEditingBooking(null);
    setForm(emptyForm);
    setFormError("");
  }

  // =========================
  // BOOKING FORM
  // =========================

  function renderBookingForm(isEdit = false) {
    return (
      <form
        onSubmit={
          isEdit
            ? handleUpdateBooking
            : handleAddBooking
        }
        className="space-y-5 p-6"
      >
        {formError && (
          <div className="border border-[#E6E1D8] bg-[#FAF7F2] px-4 py-3 text-sm text-[#8B5C5C]">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Booking ID */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Booking ID *
            </label>

            <input
              type="number"
              name="bookingId"
              value={form.bookingId}
              onChange={handleFormChange}
              disabled={isEdit}
              placeholder="e.g. 311"
              className={`w-full border border-[#E6E1D8] px-4 py-3 text-sm outline-none focus:border-[#8B7355] ${
                isEdit
                  ? "cursor-not-allowed bg-[#F7F5F0] text-[#99958E]"
                  : ""
              }`}
            />
          </div>

          {/* Tourist */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Tourist *
            </label>

            <select
              name="touristId"
              value={form.touristId}
              onChange={handleFormChange}
              className="w-full border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]"
            >
              <option value="">
                Select tourist
              </option>

              {tourists.map((tourist) => (
                <option
                  key={tourist[0]}
                  value={tourist[0]}
                >
                  {touristMap[tourist[0]]}
                </option>
              ))}
            </select>
          </div>

          {/* Package */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Tour Package *
            </label>

            <select
              name="packageId"
              value={form.packageId}
              onChange={handlePackageChange}
              className="w-full border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]"
            >
              <option value="">
                Select package
              </option>

              {packages.map((pkg) => (
                <option
                  key={pkg[0]}
                  value={pkg[0]}
                >
                  {pkg[1]} —{" "}
                  {formatAmount(pkg[6])}
                </option>
              ))}
            </select>
          </div>

          {/* Number of People */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Number of People *
            </label>

            <input
              type="number"
              name="numberOfPeople"
              min="1"
              value={form.numberOfPeople}
              onChange={handlePeopleChange}
              className="w-full border border-[#E6E1D8] px-4 py-3 text-sm outline-none focus:border-[#8B7355]"
            />
          </div>

          {/* Booking Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Booking Date *
            </label>

            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleFormChange}
              className="w-full border border-[#E6E1D8] px-4 py-3 text-sm outline-none focus:border-[#8B7355]"
            />
          </div>

          {/* Travel Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Travel Date *
            </label>

            <input
              type="date"
              name="travelDate"
              value={form.travelDate}
              min={
                form.bookingDate || undefined
              }
              onChange={handleFormChange}
              className="w-full border border-[#E6E1D8] px-4 py-3 text-sm outline-none focus:border-[#8B7355]"
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Payment Status *
            </label>

            <select
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleFormChange}
              className="w-full border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]"
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Partial</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Total Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#55514B]">
              Total Amount *
            </label>

            <input
              type="number"
              name="totalAmount"
              min="0"
              value={form.totalAmount}
              onChange={handleFormChange}
              placeholder="Calculated from package"
              className="w-full border border-[#E6E1D8] px-4 py-3 text-sm outline-none focus:border-[#8B7355]"
            />

            {form.packageId && (
              <p className="mt-2 text-xs text-[#99958E]">
                Package price × number of
                people
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-[#E6E1D8] pt-5">
          <button
            type="button"
            onClick={
              isEdit
                ? closeEditModal
                : closeAddModal
            }
            className="border border-[#E6E1D8] px-5 py-3 text-sm text-[#55514B] hover:bg-[#F7F5F0]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
              ? "Save Changes"
              : "Create Booking"}
          </button>
        </div>
      </form>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      className="space-y-8"
      onClick={() => setOpenMenu(null)}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#8B7355]">
            Booking Management
          </p>

          <div className="flex items-center gap-3">
            <h1 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
              Bookings
            </h1>

            <span
              className={`px-3 py-1 text-xs font-semibold ${
                isAdmin
                  ? "bg-[#1C1C1C] text-white"
                  : "bg-[#F2F0EB] text-[#55514B]"
              }`}
            >
              {isAdmin ? "ADMIN" : "USER"}
            </span>
          </div>

          <p className="mt-2 text-sm text-[#77736D]">
            Manage tourist reservations, travel
            dates and payments.
          </p>
        </div>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <button
            className="flex items-center justify-center gap-2 bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333]"
            onClick={(event) => {
              event.stopPropagation();
              openNewBookingModal();
            }}
          >
            <Plus size={17} />
            New Booking
          </button>
        )}
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

        <button
          className="flex items-center justify-center gap-2 border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] hover:bg-[#F7F5F0]"
          onClick={() =>
            setSortOption("Newest first")
          }
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

      {/* Table Header */}
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
          onChange={(e) =>
            setSortOption(e.target.value)
          }
          className="border-none bg-transparent text-sm text-[#77736D] outline-none"
        >
          <option>Booking ID</option>
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

                {/* Actions column */}
                {isAdmin && (
                  <th className="px-6 py-4"></th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 9 : 8}
                    className="px-6 py-12 text-center text-sm text-[#99958E]"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 9 : 8}
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
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <td className="px-6 py-5">
                      <p className="font-mono text-sm font-semibold text-[#1C1C1C]">
                        BK-{booking.id}
                      </p>

                      <p className="mt-1 text-xs text-[#99958E]">
                        Booked{" "}
                        {formatDate(
                          booking.bookingDate
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-[#1C1C1C]">
                        {booking.tourist}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm text-[#55514B]">
                        {booking.package}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={15}
                          className="text-[#8B7355]"
                        />

                        <span className="text-sm text-[#77736D]">
                          {booking.destination}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="text-[#8B7355]"
                        />

                        <span className="text-sm text-[#55514B]">
                          {formatDate(
                            booking.travelDate
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Users
                          size={15}
                          className="text-[#99958E]"
                        />

                        <span className="text-sm text-[#55514B]">
                          {booking.people}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-[#1C1C1C]">
                        {formatAmount(
                          booking.amount
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1.5 text-xs font-medium ${
                          paymentStyles[
                            booking.paymentStatus
                          ] ||
                          "bg-[#F2F0EB] text-[#55514B]"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>

                    {/* ADMIN ONLY ACTIONS */}
                    {isAdmin && (
                      <td className="relative px-6 py-5">
                        <button
                          className="p-2 text-[#77736D] hover:bg-[#F2F0EB] hover:text-[#1C1C1C]"
                          onClick={(event) => {
                            event.stopPropagation();

                            setOpenMenu(
                              openMenu === booking.id
                                ? null
                                : booking.id
                            );
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenu === booking.id && (
                          <div className="absolute right-6 top-14 z-30 w-44 border border-[#E6E1D8] bg-white py-1 shadow-xl">
                            <button
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#55514B] hover:bg-[#F7F5F0]"
                              onClick={() =>
                                handleEditBooking(
                                  booking
                                )
                              }
                            >
                              <Pencil size={15} />
                              Edit Booking
                            </button>

                            <button
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#8B5C5C] hover:bg-[#F9F0F0]"
                              onClick={() =>
                                handleDeleteBooking(
                                  booking
                                )
                              }
                            >
                              <Trash2 size={15} />
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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
              onClick={() =>
                goToPage(currentPage - 1)
              }
              disabled={currentPage === 1}
              className={`border border-[#E6E1D8] px-3 py-2 text-xs ${
                currentPage === 1
                  ? "text-[#BBB7B0]"
                  : "text-[#55514B] hover:bg-[#F7F5F0]"
              }`}
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            )
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(
                  totalPages,
                  currentPage + 2
                )
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() =>
                    goToPage(page)
                  }
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
              onClick={() =>
                goToPage(currentPage + 1)
              }
              disabled={
                currentPage === totalPages
              }
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

      {/* Add Booking Modal */}
      {showAddModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-2xl border border-[#E6E1D8] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8B7355]">
                  Booking Management
                </p>

                <h2 className="mt-1 font-['Playfair_Display'] text-2xl text-[#1C1C1C]">
                  New Booking
                </h2>
              </div>

              <button
                onClick={closeAddModal}
                className="p-2 text-[#77736D] hover:bg-[#F5F3EE] hover:text-[#1C1C1C]"
              >
                <X size={19} />
              </button>
            </div>

            {renderBookingForm(false)}
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-2xl border border-[#E6E1D8] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E1D8] px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8B7355]">
                  Booking Management
                </p>

                <h2 className="mt-1 font-['Playfair_Display'] text-2xl text-[#1C1C1C]">
                  Edit Booking
                </h2>
              </div>

              <button
                onClick={closeEditModal}
                className="p-2 text-[#77736D] hover:bg-[#F5F3EE] hover:text-[#1C1C1C]"
              >
                <X size={19} />
              </button>
            </div>

            {renderBookingForm(true)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
