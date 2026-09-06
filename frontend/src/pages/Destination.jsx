import {
  Search,
  Plus,
  MapPin,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

const destinations = [
  {
    name: "Goa",
    location: "Goa, India",
    packages: 24,
    entryFee: "₹500",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kerala",
    location: "Kerala, India",
    packages: 18,
    entryFee: "₹300",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Rajasthan",
    location: "Rajasthan, India",
    packages: 12,
    entryFee: "₹450",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kashmir",
    location: "Jammu & Kashmir, India",
    packages: 15,
    entryFee: "₹600",
    image:
      "https://images.unsplash.com/photo-1595815771614-ade9d8b3e54e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Andaman",
    location: "Andaman & Nicobar, India",
    packages: 9,
    entryFee: "₹400",
    image:
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Himachal Pradesh",
    location: "Himachal Pradesh, India",
    packages: 11,
    entryFee: "₹350",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
  },
];

function Destinations() {
  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

        <div>
          <p className="text-sm text-[#8B7355] mb-2">
            Explore the world
          </p>

          <h2 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
            Destinations
          </h2>

          <p className="text-sm text-[#77736D] mt-2">
            Manage the destinations available across your travel packages.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 bg-[#1C1C1C] text-white px-5 py-3 rounded-lg text-sm hover:bg-[#333333] transition">
          <Plus size={17} />
          Add destination
        </button>

      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99958E]"
          />

          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full bg-white border border-[#E6E1D8] rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8B7355] transition"
          />

        </div>

        <select className="bg-white border border-[#E6E1D8] rounded-lg px-4 py-3 text-sm text-[#77736D] outline-none focus:border-[#8B7355]">
          <option>All locations</option>
          <option>North India</option>
          <option>South India</option>
          <option>West India</option>
          <option>East India</option>
        </select>

      </div>

      {/* Destination count */}
      <div className="flex items-center justify-between mb-5">

        <p className="text-sm text-[#77736D]">
          <span className="font-medium text-[#1C1C1C]">
            {destinations.length}
          </span>{" "}
          destinations
        </p>

        <button className="text-xs text-[#77736D] hover:text-[#1C1C1C] transition">
          Recently added
        </button>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {destinations.map((destination) => (
          <div
            key={destination.name}
            className="group bg-white border border-[#E6E1D8] rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition"
          >

            {/* Image */}
            <div className="relative h-52 overflow-hidden">

              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[#1C1C1C] hover:bg-white transition">
                <MoreHorizontal size={18} />
              </button>

              <div className="absolute bottom-4 left-5 text-white">

                <h3 className="font-['Playfair_Display'] text-2xl">
                  {destination.name}
                </h3>

                <div className="flex items-center gap-1 mt-1 text-xs text-white/85">
                  <MapPin size={13} />
                  {destination.location}
                </div>

              </div>

            </div>

            {/* Details */}
            <div className="p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#99958E]">
                    Packages
                  </p>

                  <p className="text-sm font-medium text-[#1C1C1C] mt-1">
                    {destination.packages} available
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#99958E]">
                    Entry fee
                  </p>

                  <p className="text-sm font-medium text-[#1C1C1C] mt-1">
                    {destination.entryFee}
                  </p>
                </div>

              </div>

              <div className="border-t border-[#E6E1D8] mt-5 pt-4">

                <button className="flex items-center gap-2 text-xs text-[#8B7355] hover:text-[#1C1C1C] transition">
                  View destination
                  <ArrowUpRight size={14} />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Destinations;