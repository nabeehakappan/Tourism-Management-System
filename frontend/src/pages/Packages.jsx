import {
  Search,
  Plus,
  Clock3,
  MapPin,
  Users,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

const packages = [
  {
    name: "Kerala Escape",
    destination: "Kerala",
    duration: "5 Days · 4 Nights",
    price: "₹24,999",
    travellers: "2–6 travellers",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Goa Getaway",
    destination: "Goa",
    duration: "4 Days · 3 Nights",
    price: "₹18,500",
    travellers: "2–8 travellers",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Royal Rajasthan",
    destination: "Rajasthan",
    duration: "7 Days · 6 Nights",
    price: "₹32,999",
    travellers: "2–6 travellers",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kashmir Retreat",
    destination: "Kashmir",
    duration: "6 Days · 5 Nights",
    price: "₹29,500",
    travellers: "2–5 travellers",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1595815771614-ade9d8b3e54e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Andaman Blue",
    destination: "Andaman",
    duration: "5 Days · 4 Nights",
    price: "₹36,999",
    travellers: "2–6 travellers",
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Himalayan Trails",
    destination: "Himachal Pradesh",
    duration: "6 Days · 5 Nights",
    price: "₹27,500",
    travellers: "2–8 travellers",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
  },
];

function Packages() {
  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

        <div>
          <p className="text-sm text-[#8B7355] mb-2">
            Curated experiences
          </p>

          <h2 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
            Travel Packages
          </h2>

          <p className="text-sm text-[#77736D] mt-2">
            Create and manage the experiences offered to your tourists.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 bg-[#1C1C1C] text-white px-5 py-3 rounded-lg text-sm hover:bg-[#333333] transition">
          <Plus size={17} />
          Add package
        </button>

      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99958E]"
          />

          <input
            type="text"
            placeholder="Search packages..."
            className="w-full bg-white border border-[#E6E1D8] rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8B7355] transition"
          />

        </div>

        <select className="bg-white border border-[#E6E1D8] rounded-lg px-4 py-3 text-sm text-[#77736D] outline-none focus:border-[#8B7355]">
          <option>All destinations</option>
          <option>Goa</option>
          <option>Kerala</option>
          <option>Rajasthan</option>
          <option>Kashmir</option>
          <option>Andaman</option>
          <option>Himachal Pradesh</option>
        </select>

        <select className="bg-white border border-[#E6E1D8] rounded-lg px-4 py-3 text-sm text-[#77736D] outline-none focus:border-[#8B7355]">
          <option>All statuses</option>
          <option>Active</option>
          <option>Draft</option>
        </select>

      </div>

      {/* Package count */}
      <div className="flex items-center justify-between mb-5">

        <p className="text-sm text-[#77736D]">
          <span className="font-medium text-[#1C1C1C]">
            {packages.length}
          </span>{" "}
          packages
        </p>

        <select className="bg-transparent text-xs text-[#77736D] outline-none">
          <option>Sort by: Recently added</option>
          <option>Price: Low to high</option>
          <option>Price: High to low</option>
          <option>Duration</option>
        </select>

      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="group bg-white border border-[#E6E1D8] rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition"
          >

            {/* Image */}
            <div className="relative h-52 overflow-hidden">

              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

              {/* Status */}
              <div className="absolute top-4 left-4">

                <span
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium backdrop-blur ${
                    pkg.status === "Active"
                      ? "bg-white/90 text-[#5F7258]"
                      : "bg-white/90 text-[#77736D]"
                  }`}
                >
                  {pkg.status}
                </span>

              </div>

              {/* More */}
              <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[#1C1C1C] hover:bg-white transition">
                <MoreHorizontal size={18} />
              </button>

              {/* Package name */}
              <div className="absolute bottom-4 left-5 right-5 text-white">

                <p className="text-xs text-white/80 mb-1">
                  {pkg.destination}
                </p>

                <h3 className="font-['Playfair_Display'] text-2xl">
                  {pkg.name}
                </h3>

              </div>

            </div>

            {/* Details */}
            <div className="p-5">

              <div className="flex items-center gap-4 text-xs text-[#77736D] mb-5">

                <div className="flex items-center gap-1.5">
                  <Clock3 size={14} />
                  {pkg.duration}
                </div>

              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#77736D] mb-5">
                <Users size={14} />
                {pkg.travellers}
              </div>

              <div className="border-t border-[#E6E1D8] pt-4 flex items-end justify-between">

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#99958E]">
                    Starting from
                  </p>

                  <p className="text-xl font-semibold text-[#1C1C1C] mt-1">
                    {pkg.price}
                  </p>
                </div>

                <button className="w-9 h-9 border border-[#E6E1D8] rounded-lg flex items-center justify-center text-[#8B7355] hover:bg-[#F7F5F0] transition">
                  <ArrowUpRight size={16} />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Packages;