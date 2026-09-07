import { useState } from "react";

import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const tourists = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "+91 98765 43210",
    nationality: "Armenian",
    bookings: 4,
    joined: "12 Aug 2026",
    status: "Active",
  },
  {
    name: "Meera Thomas",
    email: "meera.thomas@gmail.com",
    phone: "+91 99887 65432",
    nationality: "Indian",
    bookings: 2,
    joined: "08 Aug 2026",
    status: "Active",
  },
  {
    name: "Pranav Ranjith",
    email: "idiot.123@gmail.com",
    phone: "+91 97654 32109",
    nationality: "Indian",
    bookings: 6,
    joined: "02 Aug 2026",
    status: "Active",
  },
  {
    name: "Ananya Menon",
    email: "ananya.menon@gmail.com",
    phone: "+91 91234 56789",
    nationality: "Indian",
    bookings: 1,
    joined: "28 Jul 2026",
    status: "Inactive",
  },
  {
    name: "Kabir Malhotra",
    email: "kabir.malhotra@gmail.com",
    phone: "+91 93456 78901",
    nationality: "Indian",
    bookings: 3,
    joined: "21 Jul 2026",
    status: "Active",
  },
  {
    name: "Diya Nair",
    email: "diya.nair@gmail.com",
    phone: "+91 95678 12345",
    nationality: "Indian",
    bookings: 5,
    joined: "17 Jul 2026",
    status: "Active",
  },
  {
    name: "Arjun Reddy",
    email: "arjun.reddy@gmail.com",
    phone: "+91 90123 45678",
    nationality: "Indian",
    bookings: 2,
    joined: "10 Jul 2026",
    status: "Active",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

function Tourists() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All tourists");

  const filteredTourists = tourists.filter((tourist) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      tourist.name.toLowerCase().includes(searchTerm) ||
      tourist.nationality.toLowerCase().includes(searchTerm) ||
      tourist.email.toLowerCase().includes(searchTerm) ||
      tourist.status.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "All tourists" ||
      tourist.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm text-[#8B7355] mb-2">
            Traveller directory
          </p>

          <h2 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
            Tourists
          </h2>

          <p className="text-sm text-[#77736D] mt-2">
            Manage registered tourists and their travel activity.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 bg-[#1C1C1C] text-white px-5 py-3 rounded-lg text-sm hover:bg-[#333333] transition">
          <Plus size={17} />
          Add tourist
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99958E]"
          />

          <input
            type="text"
            placeholder="Search tourists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E6E1D8] rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#8B7355] transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#E6E1D8] rounded-lg px-4 py-3 text-sm text-[#77736D] outline-none focus:border-[#8B7355]"
        >
          <option>All tourists</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E6E1D8] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E6E1D8]">
                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Tourist
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Contact
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Bookings
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Joined
                </th>

                <th className="px-6 py-4 text-[11px] uppercase tracking-wider font-medium text-[#99958E]">
                  Status
                </th>

                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {filteredTourists.map((tourist) => (
                <tr
                  key={tourist.email}
                  className="border-b border-[#F0ECE5] last:border-0 hover:bg-[#FCFBF8] transition"
                >
                  {/* Tourist */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E9E1D5] flex items-center justify-center text-xs font-medium text-[#6F5D49]">
                        {getInitials(tourist.name)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#1C1C1C]">
                          {tourist.name}
                        </p>

                        <p className="text-xs text-[#99958E] mt-0.5">
                          Traveller
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-[#77736D]">
                        <Mail size={13} />
                        {tourist.email}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#99958E]">
                        <Phone size={13} />
                        {tourist.phone}
                      </div>
                    </div>
                  </td>

                  {/* Bookings */}
                  <td className="px-6 py-5">
                    <span className="text-sm text-[#1C1C1C]">
                      {tourist.bookings}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-5">
                    <span className="text-sm text-[#77736D]">
                      {tourist.joined}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        tourist.status === "Active"
                          ? "bg-[#EEF2EB] text-[#63745D]"
                          : "bg-[#F2F0ED] text-[#88837B]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tourist.status === "Active"
                            ? "bg-[#718468]"
                            : "bg-[#AAA49B]"
                        }`}
                      />

                      {tourist.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-right">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#99958E] hover:bg-[#F7F5F0] hover:text-[#1C1C1C] transition">
                      <MoreHorizontal size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-[#E6E1D8] px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[#99958E]">
            Showing 1 to {filteredTourists.length} of{" "}
            {filteredTourists.length} tourists
          </p>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-[#E6E1D8] flex items-center justify-center text-[#99958E] hover:bg-[#F7F5F0] transition">
              <ChevronLeft size={15} />
            </button>

            <button className="w-8 h-8 rounded-lg bg-[#1C1C1C] text-white text-xs">
              1
            </button>

            <button className="w-8 h-8 rounded-lg border border-[#E6E1D8] text-xs text-[#77736D] hover:bg-[#F7F5F0] transition">
              2
            </button>

            <button className="w-8 h-8 rounded-lg border border-[#E6E1D8] text-xs text-[#77736D] hover:bg-[#F7F5F0] transition">
              3
            </button>

            <button className="w-8 h-8 rounded-lg border border-[#E6E1D8] flex items-center justify-center text-[#99958E] hover:bg-[#F7F5F0] transition">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tourists;