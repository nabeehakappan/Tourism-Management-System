import {
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Star,
  MapPin,
  Languages,
  BriefcaseBusiness,
} from "lucide-react";

const guides = [
  {
    id: "GD-001",
    firstName: "Rahul",
    lastName: "Menon",
    phone: "+91 98765 43210",
    email: "rahul.menon@travelia.com",
    languages: ["English", "Hindi", "Malayalam"],
    experience: 7,
    rating: 4.9,
    package: "Kerala Escape",
    destination: "Munnar, Kerala",
    tourists: 18,
  },
  {
    id: "GD-002",
    firstName: "Priya",
    lastName: "Sharma",
    phone: "+91 99887 66554",
    email: "priya.sharma@travelia.com",
    languages: ["English", "Hindi", "Tamil"],
    experience: 5,
    rating: 4.8,
    package: "Golden Triangle",
    destination: "Delhi, India",
    tourists: 14,
  },
  {
    id: "GD-003",
    firstName: "Arjun",
    lastName: "Nair",
    phone: "+91 91234 56789",
    email: "arjun.nair@travelia.com",
    languages: ["English", "Malayalam"],
    experience: 8,
    rating: 4.7,
    package: "Backwaters Bliss",
    destination: "Alleppey, Kerala",
    tourists: 21,
  },
  {
    id: "GD-004",
    firstName: "Sneha",
    lastName: "Rao",
    phone: "+91 93456 78901",
    email: "sneha.rao@travelia.com",
    languages: ["English", "Kannada", "Hindi"],
    experience: 4,
    rating: 4.6,
    package: "Coastal Karnataka",
    destination: "Gokarna, Karnataka",
    tourists: 11,
  },
  {
    id: "GD-005",
    firstName: "Vikram",
    lastName: "Singh",
    phone: "+91 97654 32109",
    email: "vikram.singh@travelia.com",
    languages: ["English", "Hindi", "Punjabi"],
    experience: 10,
    rating: 5.0,
    package: "Royal Rajasthan",
    destination: "Jaipur, Rajasthan",
    tourists: 26,
  },
  {
    id: "GD-006",
    firstName: "Ananya",
    lastName: "Iyer",
    phone: "+91 95678 12345",
    email: "ananya.iyer@travelia.com",
    languages: ["English", "Tamil", "Kannada"],
    experience: 6,
    rating: 4.8,
    package: "Goa Getaway",
    destination: "Goa, India",
    tourists: 16,
  },
];

function Guides() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#8B7355]">
            Guide Management
          </p>

          <h1 className="font-['Playfair_Display'] text-4xl text-[#1C1C1C]">
            Guides
          </h1>

          <p className="mt-2 text-sm text-[#77736D]">
            Manage tour guides, languages, experience and assignments.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333]">
          <Plus size={17} />
          Add Guide
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Total Guides
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
                24
              </p>
            </div>

            <div className="bg-[#F3EFE8] p-3 text-[#8B7355]">
              <BriefcaseBusiness size={20} />
            </div>
          </div>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Active Assignments
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
                18
              </p>
            </div>

            <div className="bg-[#EEF2EB] p-3 text-[#52614B]">
              <MapPin size={20} />
            </div>
          </div>
        </div>

        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Average Rating
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-semibold text-[#1C1C1C]">
                  4.8
                </span>

                <Star
                  size={18}
                  className="fill-[#8B7355] text-[#8B7355]"
                />
              </div>
            </div>

            <div className="bg-[#F5EEE4] p-3 text-[#8B7355]">
              <Star size={20} />
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
            placeholder="Search by guide name, email or destination..."
            className="w-full border border-[#E6E1D8] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#AAA59D] focus:border-[#8B7355]"
          />
        </div>

        <select className="border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]">
          <option>All Languages</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Malayalam</option>
          <option>Tamil</option>
          <option>Kannada</option>
        </select>

        <select className="border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]">
          <option>All Experience</option>
          <option>0–3 years</option>
          <option>4–7 years</option>
          <option>8+ years</option>
        </select>

        <button className="flex items-center justify-center gap-2 border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] hover:bg-[#F7F5F0]">
          <SlidersHorizontal size={17} />
          Filters
        </button>
      </div>

      {/* Guide Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#77736D]">
          Showing{" "}
          <span className="font-semibold text-[#1C1C1C]">
            {guides.length}
          </span>{" "}
          guides
        </p>

        <select className="border-none bg-transparent text-sm text-[#77736D] outline-none">
          <option>Highest rated</option>
          <option>Most experienced</option>
          <option>Recently added</option>
        </select>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="border border-[#E6E1D8] bg-white p-6 transition hover:border-[#D2C9BC]"
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[#E9E1D5] font-['Playfair_Display'] text-lg text-[#6F5B43]">
                  {guide.firstName.charAt(0)}
                  {guide.lastName.charAt(0)}
                </div>

                <div>
                  <h2 className="font-semibold text-[#1C1C1C]">
                    {guide.firstName} {guide.lastName}
                  </h2>

                  <p className="mt-1 text-xs text-[#99958E]">
                    {guide.id}
                  </p>
                </div>
              </div>

              <button className="p-2 text-[#77736D] hover:bg-[#F2F0EB] hover:text-[#1C1C1C]">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <p className="text-sm text-[#77736D]">
                {guide.email}
              </p>

              <p className="text-sm text-[#77736D]">
                {guide.phone}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 border-y border-[#EEEAE3] py-4">
              <div>
                <p className="text-xs text-[#99958E]">
                  Experience
                </p>

                <p className="mt-1 text-sm font-semibold text-[#1C1C1C]">
                  {guide.experience} years
                </p>
              </div>

              <div className="border-l border-[#EEEAE3] pl-5">
                <p className="text-xs text-[#99958E]">
                  Rating
                </p>

                <div className="mt-1 flex items-center gap-1">
                  <Star
                    size={14}
                    className="fill-[#8B7355] text-[#8B7355]"
                  />

                  <span className="text-sm font-semibold text-[#1C1C1C]">
                    {guide.rating}
                  </span>
                </div>
              </div>

              <div className="border-l border-[#EEEAE3] pl-5">
                <p className="text-xs text-[#99958E]">
                  Tourists
                </p>

                <p className="mt-1 text-sm font-semibold text-[#1C1C1C]">
                  {guide.tourists}
                </p>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2">
                <Languages size={15} className="text-[#8B7355]" />

                <p className="text-xs font-medium text-[#77736D]">
                  Languages Known
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {guide.languages.map((language) => (
                  <span
                    key={language}
                    className="bg-[#F7F5F0] px-3 py-1.5 text-xs text-[#55514B]"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Assignment */}
            <div className="mt-5 border-t border-[#EEEAE3] pt-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Current Assignment
              </p>

              <p className="mt-2 text-sm font-medium text-[#1C1C1C]">
                {guide.package}
              </p>

              <div className="mt-1 flex items-center gap-2 text-xs text-[#77736D]">
                <MapPin size={13} className="text-[#8B7355]" />
                {guide.destination}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#E6E1D8] pt-5">
        <p className="text-xs text-[#99958E]">
          Showing 6 of 24 guides
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

          <button className="border border-[#E6E1D8] px-3 py-2 text-xs text-[#55514B]">
            2
          </button>

          <button className="border border-[#E6E1D8] px-3 py-2 text-xs text-[#55514B]">
            3
          </button>

          <button className="border border-[#E6E1D8] px-3 py-2 text-xs text-[#55514B]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Guides;