import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Star,
  MapPin,
  Languages,
  BriefcaseBusiness,
} from "lucide-react";

const API = "http://localhost:5000/api";

function Guides() {
  const [guides, setGuides] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tourists, setTourists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [experienceFilter, setExperienceFilter] =
    useState("All Experience");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guidesResponse, packagesResponse, touristsResponse] =
          await Promise.all([
            axios.get(`${API}/guides`),
            axios.get(`${API}/packages`),
            axios.get(`${API}/tourists`),
          ]);

        const guideRows = guidesResponse.data;
        const packageRows = packagesResponse.data;
        const touristRows = touristsResponse.data;

        // Fetch languages and reviews for every guide
        const detailedGuides = await Promise.all(
          guideRows.map(async (guide) => {
            const guideId = guide[0];

            let languages = [];
            let ratings = [];

            try {
              const languageResponse = await axios.get(
                `${API}/guides/${guideId}/languages`
              );

              languages = languageResponse.data.map((row) => row[1]);
            } catch (error) {
              console.error(
                `Error fetching languages for guide ${guideId}:`,
                error
              );
            }

            try {
              const reviewResponse = await axios.get(
                `${API}/reviews/${guideId}`
              );

              ratings = reviewResponse.data
                .map((row) => Number(row[3]))
                .filter((rating) => !Number.isNaN(rating));
            } catch (error) {
              console.error(
                `Error fetching reviews for guide ${guideId}:`,
                error
              );
            }

            const averageRating =
              ratings.length > 0
                ? ratings.reduce((sum, rating) => sum + rating, 0) /
                  ratings.length
                : null;

            return {
              id: guideId,
              firstName: guide[1],
              lastName: guide[2],
              phone: guide[3],
              email: guide[4],
              experience: Number(guide[5]) || 0,
              languages,
              rating: averageRating,
            };
          })
        );

        const mappedPackages = packageRows.map((pkg) => ({
          packageId: pkg[0],
          name: pkg[1],
          city: pkg[2],
          state: pkg[3],
          country: pkg[4],
          duration: Number(pkg[5]) || 0,
          price: Number(pkg[6]) || 0,
          type: pkg[7],
          guideId: pkg[8],
        }));

        const mappedTourists = touristRows.map((tourist) => ({
          touristId: tourist[0],
          guideId: tourist[12],
        }));

        setGuides(detailedGuides);
        setPackages(mappedPackages);
        setTourists(mappedTourists);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all languages from actual database data
  const languages = useMemo(() => {
    const allLanguages = guides.flatMap((guide) => guide.languages);

    return [
      "All Languages",
      ...new Set(allLanguages.filter(Boolean)),
    ];
  }, [guides]);

  const filteredGuides = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return guides.filter((guide) => {
      const fullName =
        `${guide.firstName} ${guide.lastName}`.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        fullName.includes(searchTerm) ||
        guide.email.toLowerCase().includes(searchTerm) ||
        guide.phone.toLowerCase().includes(searchTerm);

      const matchesLanguage =
        languageFilter === "All Languages" ||
        guide.languages.includes(languageFilter);

      let matchesExperience = true;

      if (experienceFilter === "0–3 years") {
        matchesExperience =
          guide.experience >= 0 && guide.experience <= 3;
      }

      if (experienceFilter === "4–7 years") {
        matchesExperience =
          guide.experience >= 4 && guide.experience <= 7;
      }

      if (experienceFilter === "8+ years") {
        matchesExperience = guide.experience >= 8;
      }

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesExperience
      );
    });
  }, [
    guides,
    search,
    languageFilter,
    experienceFilter,
  ]);

  const getGuidePackages = (guideId) => {
    return packages.filter((pkg) => pkg.guideId === guideId);
  };

  const getGuideTouristCount = (guideId) => {
    return tourists.filter((tourist) => tourist.guideId === guideId)
      .length;
  };

  const totalGuides = guides.length;

  const activeAssignments = guides.filter(
    (guide) => getGuidePackages(guide.id).length > 0
  ).length;

  const ratedGuides = guides.filter(
    (guide) => guide.rating !== null
  );

  const averageRating =
    ratedGuides.length > 0
      ? (
          ratedGuides.reduce(
            (sum, guide) => sum + guide.rating,
            0
          ) / ratedGuides.length
        ).toFixed(1)
      : "—";

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

        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-[#1C1C1C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333]"
        >
          <BriefcaseBusiness size={17} />
          Add Guide
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Guides */}
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Total Guides
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
                {loading ? "—" : totalGuides}
              </p>
            </div>

            <div className="bg-[#F3EFE8] p-3 text-[#8B7355]">
              <BriefcaseBusiness size={20} />
            </div>
          </div>
        </div>

        {/* Active Assignments */}
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Active Assignments
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#1C1C1C]">
                {loading ? "—" : activeAssignments}
              </p>
            </div>

            <div className="bg-[#EEF2EB] p-3 text-[#52614B]">
              <MapPin size={20} />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="border border-[#E6E1D8] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                Average Rating
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-semibold text-[#1C1C1C]">
                  {loading ? "—" : averageRating}
                </span>

                {averageRating !== "—" && (
                  <Star
                    size={18}
                    className="fill-[#8B7355] text-[#8B7355]"
                  />
                )}
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
            placeholder="Search by guide name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#E6E1D8] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#AAA59D] focus:border-[#8B7355]"
          />
        </div>

        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>

        <select
          value={experienceFilter}
          onChange={(e) =>
            setExperienceFilter(e.target.value)
          }
          className="border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] outline-none focus:border-[#8B7355]"
        >
          <option>All Experience</option>
          <option>0–3 years</option>
          <option>4–7 years</option>
          <option>8+ years</option>
        </select>

        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-[#E6E1D8] bg-white px-4 py-3 text-sm text-[#55514B] hover:bg-[#F7F5F0]"
        >
          <SlidersHorizontal size={17} />
          Filters
        </button>
      </div>

      {/* Guide Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#77736D]">
          Showing{" "}
          <span className="font-semibold text-[#1C1C1C]">
            {loading ? "—" : filteredGuides.length}
          </span>{" "}
          guides
        </p>

        <div className="text-sm text-[#77736D]">
          {search ||
          languageFilter !== "All Languages" ||
          experienceFilter !== "All Experience"
            ? "Filtered results"
            : "All guides"}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="border border-[#E6E1D8] bg-white py-20 text-center">
          <p className="text-sm text-[#77736D]">
            Loading guides...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredGuides.length === 0 && (
        <div className="border border-[#E6E1D8] bg-white py-20 text-center">
          <p className="font-['Playfair_Display'] text-2xl text-[#1C1C1C]">
            No guides found
          </p>

          <p className="mt-2 text-sm text-[#77736D]">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setLanguageFilter("All Languages");
              setExperienceFilter("All Experience");
            }}
            className="mt-5 border border-[#E6E1D8] px-4 py-2 text-sm text-[#55514B] hover:bg-[#F7F5F0]"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Guide Cards */}
      {!loading && filteredGuides.length > 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredGuides.map((guide) => {
            const guidePackages = getGuidePackages(guide.id);
            const touristCount = getGuideTouristCount(guide.id);

            const primaryPackage = guidePackages[0];

            return (
              <div
                key={guide.id}
                className="border border-[#E6E1D8] bg-white p-6 transition hover:border-[#D2C9BC]"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center bg-[#E9E1D5] font-['Playfair_Display'] text-lg text-[#6F5B43]">
                      {guide.firstName?.charAt(0)}
                      {guide.lastName?.charAt(0)}
                    </div>

                    <div>
                      <h2 className="font-semibold text-[#1C1C1C]">
                        {guide.firstName} {guide.lastName}
                      </h2>

                      <p className="mt-1 text-xs text-[#99958E]">
                        GD-{String(guide.id).padStart(3, "0")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-2 text-[#77736D] hover:bg-[#F2F0EB] hover:text-[#1C1C1C]"
                  >
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
                      {guide.rating !== null ? (
                        <>
                          <Star
                            size={14}
                            className="fill-[#8B7355] text-[#8B7355]"
                          />

                          <span className="text-sm font-semibold text-[#1C1C1C]">
                            {guide.rating.toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-[#99958E]">
                          No rating
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-l border-[#EEEAE3] pl-5">
                    <p className="text-xs text-[#99958E]">
                      Tourists
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#1C1C1C]">
                      {touristCount}
                    </p>
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Languages
                      size={15}
                      className="text-[#8B7355]"
                    />

                    <p className="text-xs font-medium text-[#77736D]">
                      Languages Known
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {guide.languages.length > 0 ? (
                      guide.languages.map((language) => (
                        <span
                          key={language}
                          className="bg-[#F7F5F0] px-3 py-1.5 text-xs text-[#55514B]"
                        >
                          {language}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#99958E]">
                        No languages recorded
                      </span>
                    )}
                  </div>
                </div>

                {/* Assignment */}
                <div className="mt-5 border-t border-[#EEEAE3] pt-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#99958E]">
                    Current Assignment
                  </p>

                  {primaryPackage ? (
                    <>
                      <p className="mt-2 text-sm font-medium text-[#1C1C1C]">
                        {primaryPackage.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-[#77736D]">
                        <MapPin
                          size={13}
                          className="text-[#8B7355]"
                        />

                        {primaryPackage.city},{" "}
                        {primaryPackage.state},{" "}
                        {primaryPackage.country}
                      </div>

                      {guidePackages.length > 1 && (
                        <p className="mt-2 text-xs text-[#99958E]">
                          + {guidePackages.length - 1} more assigned{" "}
                          {guidePackages.length - 1 === 1
                            ? "package"
                            : "packages"}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-[#99958E]">
                      No package currently assigned
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Guides;
