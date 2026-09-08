import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const packageImages = [
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
];

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("All destinations");
  const [packageType, setPackageType] = useState("All types");

  const [currentPage, setCurrentPage] = useState(1);

  const packagesPerPage = 6;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/packages"
        );

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

    fetchPackages();
  }, []);

  // Get unique destinations directly from the database data
  const destinations = useMemo(() => {
    return [
      "All destinations",
      ...new Set(packages.map((pkg) => pkg.city).filter(Boolean)),
    ];
  }, [packages]);

  // Get unique package types directly from the database data
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
        pkg.name.toLowerCase().includes(searchTerm) ||
        pkg.city.toLowerCase().includes(searchTerm) ||
        pkg.state.toLowerCase().includes(searchTerm) ||
        pkg.country.toLowerCase().includes(searchTerm);

      const matchesDestination =
        destination === "All destinations" ||
        pkg.city === destination;

      const matchesType =
        packageType === "All types" ||
        pkg.type === packageType;

      return matchesSearch && matchesDestination && matchesType;
    });
  }, [packages, search, destination, packageType]);

  // Reset to page 1 whenever filters change
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

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-xl border border-[#dedbd4] bg-white px-4 py-2.5 text-sm font-medium text-[#34322e] transition hover:border-[#bcb5a8]"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-[#e5e1da] bg-white p-4 shadow-sm lg:flex-row">
        {/* Search */}
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

        {/* Destination */}
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

        {/* Package Type */}
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
              className="group overflow-hidden rounded-2xl border border-[#e3dfd7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
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

              {/* Content */}
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl leading-tight text-[#292724]">
                      {pkg.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#817c73]">
                      {pkg.city}, {pkg.state}, {pkg.country}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ded9d0] text-[#686158] transition hover:bg-[#f7f5f1]"
                    aria-label={`View ${pkg.name}`}
                  >
                    <ArrowUpRight size={16} />
                  </button>
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
                      {pkg.duration} Days · {Math.max(pkg.duration - 1, 0)} Nights
                    </p>
                  </div>
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

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
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
            )
          )}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ded9d0] bg-white text-[#625d55] transition hover:bg-[#f7f5f1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Packages;

