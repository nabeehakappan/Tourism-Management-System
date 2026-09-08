import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

const API = "http://localhost:5000/api";

const packageImages = [
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
];

const emptyForm = {
  packageId: "",
  packageName: "",
  destinationCity: "",
  destinationState: "",
  destinationCountry: "",
  duration: "",
  price: "",
  packageType: "",
  guideId: "",
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("traveliaUser") || "null");
  } catch {
    return null;
  }
}

function Packages() {
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("All destinations");
  const [packageType, setPackageType] = useState("All types");

  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;

  // RBAC
  const [currentUser] = useState(getStoredUser);
  const isAdmin = currentUser?.role === "ADMIN";

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Action menu
  const [openMenu, setOpenMenu] = useState(null);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API}/packages`);

      const mappedPackages = response.data.map((pkg, index) => ({
        packageId: pkg[0],
        name: pkg[1],
        city: pkg[2],
        state: pkg[3],
        country: pkg[4],
        duration: pkg[5],
        price: pkg[6],
        type: pkg[7],
        guideId: pkg[8],
        image: packageImages[index % packageImages.length],
      }));

      setPackages(mappedPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuides = async () => {
    try {
      const response = await axios.get(`${API}/guides`);

      const mappedGuides = response.data.map((guide) => ({
        guideId: guide[0],
        firstName: guide[1],
        lastName: guide[2],
      }));

      setGuides(mappedGuides);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchGuides();
  }, []);

  const destinations = useMemo(() => {
    return [
      "All destinations",
      ...new Set(packages.map((pkg) => pkg.city).filter(Boolean)),
    ];
  }, [packages]);

  const packageTypes = useMemo(() => {
    return [
      "All types",
      ...new Set(packages.map((pkg) => pkg.type).filter(Boolean)),
    ];
  }, [packages]);

  const filteredPackages = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return packages.filter((pkg) => {
      const matchesSearch =
        !searchTerm ||
        pkg.name?.toLowerCase().includes(searchTerm) ||
        pkg.city?.toLowerCase().includes(searchTerm) ||
        pkg.state?.toLowerCase().includes(searchTerm) ||
        pkg.country?.toLowerCase().includes(searchTerm);

      const matchesDestination =
        destination === "All destinations" ||
        pkg.city === destination;

      const matchesType =
        packageType === "All types" ||
        pkg.type === packageType;

      return matchesSearch && matchesDestination && matchesType;
    });
  }, [packages, search, destination, packageType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, destination, packageType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPackages.length / packagesPerPage)
  );

  const startIndex = (currentPage - 1) * packagesPerPage;

  const currentPackages = filteredPackages.slice(
    startIndex,
    startIndex + packagesPerPage
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  const validateForm = () => {
    if (
      !form.packageId ||
      !form.packageName.trim() ||
      !form.destinationCity.trim() ||
      !form.destinationState.trim() ||
      !form.destinationCountry.trim() ||
      !form.duration ||
      form.price === "" ||
      !form.packageType ||
      !form.guideId
    ) {
      setFormError("Please fill in all fields.");
      return false;
    }

    if (Number(form.duration) <= 0) {
      setFormError("Duration must be greater than 0.");
      return false;
    }

    if (Number(form.price) < 0) {
      setFormError("Price cannot be negative.");
      return false;
    }

    return true;
  };

  const getPackagePayload = () => ({
    packageId: Number(form.packageId),
    packageName: form.packageName.trim(),
    destinationCity: form.destinationCity.trim(),
    destinationState: form.destinationState.trim(),
    destinationCountry: form.destinationCountry.trim(),
    duration: Number(form.duration),
    price: Number(form.price),
    packageType: form.packageType,
    guideId: Number(form.guideId),
  });

  const handleAddPackage = async (e) => {
    e.preventDefault();

    if (!isAdmin) return;

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      await axios.post(`${API}/packages`, getPackagePayload());

      await fetchPackages();

      setForm(emptyForm);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding package:", error);

      setFormError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to add package. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditPackage = (pkg) => {
    if (!isAdmin) return;

    setOpenMenu(null);

    setEditingPackage(pkg);

    setForm({
      packageId: String(pkg.packageId),
      packageName: pkg.name || "",
      destinationCity: pkg.city || "",
      destinationState: pkg.state || "",
      destinationCountry: pkg.country || "",
      duration: String(pkg.duration ?? ""),
      price: String(pkg.price ?? ""),
      packageType: pkg.type || "",
      guideId: String(pkg.guideId ?? ""),
    });

    setFormError("");
    setShowEditModal(true);
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();

    if (!isAdmin) return;

    if (!validateForm()) {
      return;
    }

    if (!editingPackage) {
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      await axios.put(
        `${API}/packages/${editingPackage.packageId}`,
        getPackagePayload()
      );

      await fetchPackages();

      setForm(emptyForm);
      setEditingPackage(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating package:", error);

      setFormError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update package. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (pkg) => {
    if (!isAdmin) return;

    setOpenMenu(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${pkg.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API}/packages/${pkg.packageId}`);

      await fetchPackages();

      setCurrentPage((page) => {
        const remainingItems = filteredPackages.length - 1;

        const remainingPages = Math.max(
          1,
          Math.ceil(remainingItems / packagesPerPage)
        );

        return Math.min(page, remainingPages);
      });
    } catch (error) {
      console.error("Error deleting package:", error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to delete package.";

      window.alert(
        message.includes("constraint") ||
          message.includes("ORA-02292") ||
          message.includes("child record")
          ? "This package cannot be deleted because it is already used in one or more bookings. Please keep the package to preserve booking records."
          : message
      );
    }
  };

  const closeAddModal = () => {
    if (saving) return;

    setShowAddModal(false);
    setForm(emptyForm);
    setFormError("");
  };

  const closeEditModal = () => {
    if (saving) return;

    setShowEditModal(false);
    setEditingPackage(null);
    setForm(emptyForm);
    setFormError("");
  };

  const getGuideName = (guideId) => {
    const guide = guides.find(
      (item) => Number(item.guideId) === Number(guideId)
    );

    if (!guide) {
      return "Unassigned";
    }

    return `${guide.firstName} ${guide.lastName}`;
  };

  const renderPackageForm = (isEdit = false) => (
    <form
      onSubmit={isEdit ? handleUpdatePackage : handleAddPackage}
      className="p-6"
    >
      {formError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Package ID */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Package ID
          </label>

          <input
            type="number"
            name="packageId"
            value={form.packageId}
            onChange={handleFormChange}
            placeholder="e.g. 207"
            disabled={isEdit}
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a99b86] disabled:cursor-not-allowed disabled:bg-[#f2f0ec] disabled:text-[#858078]"
          />
        </div>

        {/* Package Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Package Name
          </label>

          <input
            type="text"
            name="packageName"
            value={form.packageName}
            onChange={handleFormChange}
            placeholder="e.g. Mysore Heritage Tour"
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a99b86]"
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Destination City
          </label>

          <input
            type="text"
            name="destinationCity"
            value={form.destinationCity}
            onChange={handleFormChange}
            placeholder="e.g. Mysore"
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a99b86]"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Destination State
          </label>

          <input
            type="text"
            name="destinationState"
            value={form.destinationState}
            onChange={handleFormChange}
            placeholder="e.g. Karnataka"
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a99b86]"
          />
        </div>

        {/* Country */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Destination Country
          </label>

          <input
            type="text"
            name="destinationCountry"
            value={form.destinationCountry}
            onChange={handleFormChange}
            placeholder="e.g. India"
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a99b86]"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Duration (Days)
          </label>

          <input
            type="number"
            min="1"
            name="duration"
            value={form.duration}
            onChange={handleFormChange}
            placeholder="e.g. 4"
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a99b86]"
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Price (₹)
          </label>

          <input
            type="number"
            min="0"
            name="price"
            value={form.price}
            onChange={handleFormChange}
            placeholder="e.g. 22000"
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a99b86]"
          />
        </div>

        {/* Package Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Package Type
          </label>

          <select
            name="packageType"
            value={form.packageType}
            onChange={handleFormChange}
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm text-[#45413b] outline-none focus:border-[#a99b86]"
          >
            <option value="">Select type</option>
            <option value="Cultural">Cultural</option>
            <option value="Relaxation">Relaxation</option>
            <option value="Adventure">Adventure</option>
            <option value="Beach">Beach</option>
            <option value="International">International</option>
          </select>
        </div>

        {/* Guide */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#45413b]">
            Assigned Guide
          </label>

          <select
            name="guideId"
            value={form.guideId}
            onChange={handleFormChange}
            className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm text-[#45413b] outline-none focus:border-[#a99b86]"
          >
            <option value="">Select a guide</option>

            {guides.map((guide) => (
              <option key={guide.guideId} value={guide.guideId}>
                {guide.firstName} {guide.lastName} — ID {guide.guideId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-7 flex justify-end gap-3">
        <button
          type="button"
          onClick={isEdit ? closeEditModal : closeAddModal}
          disabled={saving}
          className="rounded-xl border border-[#ded9d0] bg-white px-5 py-2.5 text-sm font-medium text-[#514c44] transition hover:bg-[#f5f2ed] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#2b2926] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#403d38] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
            ? "Save Changes"
            : "Add Package"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#9a8b72]">
            Explore
          </p>

          <h1 className="font-serif text-4xl tracking-tight text-[#242321]">
            Tour Packages
          </h1>

          <p className="mt-2 max-w-xl text-sm text-[#77736b]">
            Discover carefully curated experiences across India and beyond.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* ADMIN ONLY */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setFormError("");
                setShowAddModal(true);
              }}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#2b2926] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#403d38]"
            >
              <Plus size={16} />
              Add Package
            </button>
          )}

          <button
            type="button"
            className="flex w-fit items-center gap-2 rounded-xl border border-[#dedbd4] bg-white px-4 py-2.5 text-sm font-medium text-[#34322e] transition hover:border-[#bcb5a8]"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-[#e5e1da] bg-white p-4 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99948a]"
          />

          <input
            type="text"
            placeholder="Search packages, cities or countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#e5e1da] bg-[#faf9f7] py-3 pl-11 pr-4 text-sm text-[#292724] outline-none transition placeholder:text-[#aaa59c] focus:border-[#b9af9d]"
          />
        </div>

        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="rounded-xl border border-[#e5e1da] bg-[#faf9f7] px-4 py-3 text-sm text-[#45413b] outline-none focus:border-[#b9af9d]"
        >
          {destinations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={packageType}
          onChange={(e) => setPackageType(e.target.value)}
          className="rounded-xl border border-[#e5e1da] bg-[#faf9f7] px-4 py-3 text-sm text-[#45413b] outline-none focus:border-[#b9af9d]"
        >
          {packageTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[#77736b]">
            Showing{" "}
            <span className="font-medium text-[#38352f]">
              {filteredPackages.length}
            </span>{" "}
            {filteredPackages.length === 1 ? "package" : "packages"}
          </p>

          {(search ||
            destination !== "All destinations" ||
            packageType !== "All types") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDestination("All destinations");
                setPackageType("All types");
              }}
              className="text-xs font-medium text-[#8b7655] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-[#77736b]">Loading packages...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && currentPackages.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#e5e1da] bg-white text-center">
          <p className="font-serif text-2xl text-[#34312c]">
            No packages found
          </p>

          <p className="mt-2 text-sm text-[#858078]">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDestination("All destinations");
              setPackageType("All types");
            }}
            className="mt-5 rounded-xl border border-[#d8d2c8] px-4 py-2 text-sm font-medium text-[#4b463e] hover:bg-[#faf9f7]"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Package Grid */}
      {!loading && currentPackages.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {currentPackages.map((pkg) => (
            <div
              key={pkg.packageId}
              className="group overflow-visible rounded-2xl border border-[#e3dfd7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden rounded-t-2xl">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#45413b] backdrop-blur-sm">
                  {pkg.type}
                </div>

                <div className="absolute bottom-4 right-4 rounded-full bg-[#242321]/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  {pkg.duration} Days
                </div>
              </div>

              {/* Card content */}
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-serif text-xl leading-tight text-[#292724]">
                      {pkg.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#817c73]">
                      {pkg.city}, {pkg.state}, {pkg.country}
                    </p>
                  </div>

                  {/* ADMIN ONLY */}
                  {isAdmin && (
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === pkg.packageId
                              ? null
                              : pkg.packageId
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ded9d0] text-[#686158] transition hover:bg-[#f7f5f1]"
                        aria-label={`Actions for ${pkg.name}`}
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      {openMenu === pkg.packageId && (
                        <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-xl border border-[#e3dfd7] bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => handleEditPackage(pkg)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#45413b] transition hover:bg-[#f7f5f1]"
                          >
                            <Pencil size={15} />
                            Edit Package
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePackage(pkg)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            Delete Package
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="my-5 h-px bg-[#eeeae3]" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#99938a]">
                      From
                    </p>

                    <p className="mt-1 text-lg font-semibold text-[#292724]">
                      ₹{Number(pkg.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#99938a]">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#4d4840]">
                      {pkg.duration} Days ·{" "}
                      {Math.max(pkg.duration - 1, 0)} Nights
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#eeeae3] pt-4">
                  <p className="text-xs text-[#99938a]">Guide</p>

                  <p className="text-xs font-medium text-[#5b554d]">
                    {getGuideName(pkg.guideId)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredPackages.length > packagesPerPage && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((page) => Math.max(page - 1, 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ded9d0] bg-white text-[#625d55] transition hover:bg-[#f7f5f1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-9 min-w-9 rounded-lg px-3 text-sm transition ${
                currentPage === page
                  ? "bg-[#2b2926] text-white"
                  : "border border-[#ded9d0] bg-white text-[#625d55] hover:bg-[#f7f5f1]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(page + 1, totalPages)
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ded9d0] bg-white text-[#625d55] transition hover:bg-[#f7f5f1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add Package Modal */}
      {showAddModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e3dfd7] bg-[#fdfcf9] shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e7e2da] px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9a8b72]">
                  Management
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#292724]">
                  Add Package
                </h2>

                <p className="mt-1 text-sm text-[#77736b]">
                  Create a new tour package in TRAVELIA.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ded9d0] text-[#686158] transition hover:bg-[#f3f0eb]"
              >
                <X size={17} />
              </button>
            </div>

            {renderPackageForm(false)}
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#e3dfd7] bg-[#fdfcf9] shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#e7e2da] px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9a8b72]">
                  Management
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#292724]">
                  Edit Package
                </h2>

                <p className="mt-1 text-sm text-[#77736b]">
                  Update package details and guide assignment.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ded9d0] text-[#686158] transition hover:bg-[#f3f0eb]"
              >
                <X size={17} />
              </button>
            </div>

            {renderPackageForm(true)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Packages;
