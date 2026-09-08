import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Pencil,
  Trash2,
  MessageSquareText,
  X,
} from "lucide-react";

const API = "http://localhost:5000/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("traveliaUser") || "null");
  } catch {
    return null;
  }
};

const emptyGuideForm = {
  guideId: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  experienceYears: "",
};

function Guides() {
  const [guides, setGuides] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tourists, setTourists] = useState([]);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [editingGuide, setEditingGuide] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const [form, setForm] = useState(emptyGuideForm);

  const [reviewForm, setReviewForm] = useState({
    reviewText: "",
    reviewDate: "",
    rating: "",
  });

  const [reviews, setReviews] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  // =========================
  // RBAC
  // =========================

  const [currentUser] = useState(getStoredUser);

  const isAdmin = currentUser?.role === "ADMIN";

  // =========================
  // FETCH DATA
  // =========================

  const fetchGuides = async () => {
    try {
      const response = await axios.get(`${API}/guides`);

      const data = response.data.map((guide) => ({
        id: Number(guide[0]),
        firstName: guide[1],
        lastName: guide[2],
        phone: guide[3],
        email: guide[4],
        experienceYears: guide[5],
      }));

      setGuides(data);
    } catch (err) {
      console.error("Error fetching guides:", err);
      setError("Failed to load guides.");
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API}/packages`);

      const data = response.data.map((pkg) => ({
        id: Number(pkg[0]),
        name: pkg[1],
        destination: `${pkg[2]}, ${pkg[3]}`,
        duration: pkg[5],
        price: pkg[6],
        type: pkg[7],
        guideId: Number(pkg[8]),
      }));

      setPackages(data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const fetchTourists = async () => {
    try {
      const response = await axios.get(`${API}/tourists`);

      const data = response.data.map((tourist) => ({
        id: Number(tourist[0]),
        firstName: tourist[1],
        middleName: tourist[2],
        lastName: tourist[3],
        guideId: Number(tourist[12]),
      }));

      setTourists(data);
    } catch (err) {
      console.error("Error fetching tourists:", err);
    }
  };

  useEffect(() => {
    fetchGuides();
    fetchPackages();
    fetchTourists();
  }, []);

  // =========================
  // HELPERS
  // =========================

  const getGuidePackages = (guideId) => {
    return packages.filter((pkg) => pkg.guideId === guideId);
  };

  const getGuideTourists = (guideId) => {
    return tourists.filter((tourist) => tourist.guideId === guideId);
  };

  const getPrimaryPackage = (guideId) => {
    const guidePackages = getGuidePackages(guideId);

    return guidePackages.length > 0 ? guidePackages[0] : null;
  };

  const getGuideRating = (guideId) => {
    const guide = guides.find((item) => item.id === guideId);

    if (!guide) return null;

    return guide.rating || null;
  };

  // =========================
  // SEARCH
  // =========================

  const filteredGuides = guides.filter((guide) => {
    const query = search.toLowerCase();

    const fullName = `${guide.firstName} ${guide.lastName}`.toLowerCase();

    return (
      String(guide.id).includes(query) ||
      fullName.includes(query) ||
      String(guide.email || "").toLowerCase().includes(query) ||
      String(guide.phone || "").toLowerCase().includes(query)
    );
  });

  // =========================
  // ADD GUIDE
  // =========================

  const handleAddGuide = async (e) => {
    e.preventDefault();

    if (!isAdmin) return;

    setSaving(true);
    setError("");

    try {
      await axios.post(`${API}/guides`, {
        guideId: Number(form.guideId),
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        experienceYears: Number(form.experienceYears),
      });

      await fetchGuides();

      setForm(emptyGuideForm);
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding guide:", err);

      setError(
        err.response?.data?.error ||
          "Failed to add guide. Please check the entered details."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT GUIDE
  // =========================

  const openEditModal = (guide) => {
    if (!isAdmin) return;

    setEditingGuide(guide);

    setForm({
      guideId: guide.id,
      firstName: guide.firstName || "",
      lastName: guide.lastName || "",
      phone: guide.phone || "",
      email: guide.email || "",
      experienceYears: guide.experienceYears ?? "",
    });

    setShowEditModal(true);
    setOpenMenu(null);
  };

  const handleEditGuide = async (e) => {
    e.preventDefault();

    if (!isAdmin || !editingGuide) return;

    setSaving(true);
    setError("");

    try {
      await axios.put(`${API}/guides/${editingGuide.id}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        experienceYears: Number(form.experienceYears),
      });

      await fetchGuides();

      setShowEditModal(false);
      setEditingGuide(null);
      setForm(emptyGuideForm);
    } catch (err) {
      console.error("Error updating guide:", err);

      setError(
        err.response?.data?.error ||
          "Failed to update guide. Please check the entered details."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE GUIDE
  // =========================

  const handleDeleteGuide = async (guideId) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this guide?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/guides/${guideId}`);

      await fetchGuides();

      setOpenMenu(null);
    } catch (err) {
      console.error("Error deleting guide:", err);

      alert(
        err.response?.data?.error ||
          "Unable to delete this guide. They may still be assigned to packages or tourists."
      );
    }
  };

  // =========================
  // REVIEWS
  // =========================

  const openReviewModal = async (guide) => {
    if (!isAdmin) return;

    setSelectedGuide(guide);
    setReviewForm({
      reviewText: "",
      reviewDate: "",
      rating: "",
    });

    try {
      const response = await axios.get(`${API}/reviews/${guide.id}`);

      const data = response.data.map((review) => ({
        guideId: Number(review[0]),
        reviewText: review[1],
        reviewDate: review[2],
        rating: review[3],
      }));

      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }

    setShowReviewModal(true);
    setOpenMenu(null);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!isAdmin || !selectedGuide) return;

    setSaving(true);
    setError("");

    try {
      await axios.post(`${API}/reviews/${selectedGuide.id}`, {
        reviewText: reviewForm.reviewText,
        reviewDate: reviewForm.reviewDate,
        rating: Number(reviewForm.rating),
      });

      const response = await axios.get(
        `${API}/reviews/${selectedGuide.id}`
      );

      const data = response.data.map((review) => ({
        guideId: Number(review[0]),
        reviewText: review[1],
        reviewDate: review[2],
        rating: review[3],
      }));

      setReviews(data);

      setReviewForm({
        reviewText: "",
        reviewDate: "",
        rating: "",
      });
    } catch (err) {
      console.error("Error adding review:", err);

      setError(
        err.response?.data?.error || "Failed to add review."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // FORM INPUT
  // =========================

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // FORM COMPONENT
  // =========================

  const renderGuideForm = (isEdit = false) => (
    <form
      onSubmit={isEdit ? handleEditGuide : handleAddGuide}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Guide ID
          </label>

          <input
            type="number"
            name="guideId"
            value={form.guideId}
            onChange={handleFormChange}
            disabled={isEdit}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
            placeholder="101"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Experience (Years)
          </label>

          <input
            type="number"
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleFormChange}
            min="0"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
            placeholder="5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleFormChange}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
            placeholder="Aarav"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleFormChange}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
            placeholder="Sharma"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleFormChange}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
          placeholder="guide@email.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleFormChange}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
          placeholder="+91 9876543210"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setError("");
          }}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEdit
            ? "Save Changes"
            : "Add Guide"}
        </button>
      </div>
    </form>
  );

  // =========================
  // REVIEW MODAL
  // =========================

  const renderReviewModal = () => {
    if (!selectedGuide) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Guide Reviews
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                {selectedGuide.firstName} {selectedGuide.lastName}
              </h2>
            </div>

            <button
              onClick={() => setShowReviewModal(false)}
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-7">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Existing Reviews
            </h3>

            {reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                No reviews yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <div
                    key={`${review.guideId}-${index}`}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= review.rating
                                ? "text-amber-500"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <span className="text-xs text-gray-400">
                        {review.reviewDate
                          ? new Date(review.reviewDate).toLocaleDateString()
                          : ""}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-gray-600">
                      {review.reviewText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <form
              onSubmit={handleAddReview}
              className="border-t border-gray-100 pt-6"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Add Review
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Review
                  </label>

                  <textarea
                    name="reviewText"
                    value={reviewForm.reviewText}
                    onChange={handleReviewChange}
                    required
                    rows="3"
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
                    placeholder="Write a review..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Review Date
                    </label>

                    <input
                      type="date"
                      name="reviewDate"
                      value={reviewForm.reviewDate}
                      onChange={handleReviewChange}
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Rating
                    </label>

                    <select
                      name="rating"
                      value={reviewForm.rating}
                      onChange={handleReviewChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-400"
                    >
                      <option value="">Select rating</option>
                      <option value="5">5 — Excellent</option>
                      <option value="4">4 — Very Good</option>
                      <option value="3">3 — Good</option>
                      <option value="2">2 — Fair</option>
                      <option value="1">1 — Poor</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? "Adding..." : "Add Review"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-[#f8f7f4] p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              Travelia Management
            </p>

            <div className="flex items-center gap-3">
              <h1 className="font-serif text-4xl text-gray-900">
                Guides
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isAdmin
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {isAdmin ? "ADMIN" : "USER"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Manage your travel guides and their assigned tours.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setForm(emptyGuideForm);
                setError("");
                setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              <Plus size={18} />
              Add Guide
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div className="text-sm text-gray-400">
            {filteredGuides.length} guide
            {filteredGuides.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Guide Cards */}
        {filteredGuides.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <p className="text-sm text-gray-400">
              No guides found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredGuides.map((guide) => {
              const primaryPackage = getPrimaryPackage(guide.id);
              const guidePackages = getGuidePackages(guide.id);
              const guideTourists = getGuideTourists(guide.id);
              const rating = getGuideRating(guide.id);

              return (
                <div
                  key={guide.id}
                  className="relative overflow-visible rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eeeae2] font-serif text-lg text-gray-700">
                        {guide.firstName?.charAt(0)}
                        {guide.lastName?.charAt(0)}
                      </div>

                      <div>
                        <h2 className="font-serif text-xl text-gray-900">
                          {guide.firstName} {guide.lastName}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                          Guide #{guide.id}
                        </p>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === guide.id ? null : guide.id
                            )
                          }
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {openMenu === guide.id && (
                          <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
                            <button
                              onClick={() => openEditModal(guide)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                            >
                              <Pencil size={16} />
                              Edit Guide
                            </button>

                            <button
                              onClick={() => openReviewModal(guide)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                            >
                              <MessageSquareText size={16} />
                              Reviews
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteGuide(guide.id)
                              }
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete Guide
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-3 border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <span className="truncate">
                        {guide.email || "No email"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      <span>
                        {guide.phone || "No phone"}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {guide.experienceYears}
                      </p>

                      <p className="text-[10px] uppercase tracking-wide text-gray-400">
                        Years
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {guidePackages.length}
                      </p>

                      <p className="text-[10px] uppercase tracking-wide text-gray-400">
                        Tours
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {guideTourists.length}
                      </p>

                      <p className="text-[10px] uppercase tracking-wide text-gray-400">
                        Tourists
                      </p>
                    </div>
                  </div>

                  {/* Assigned Package */}
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Assigned Package
                    </p>

                    {primaryPackage ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {primaryPackage.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {primaryPackage.destination}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No package assigned
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  {rating && (
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= rating
                                ? "text-amber-500"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <span className="text-xs text-gray-400">
                        {rating}/5
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Guide Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Guide Management
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                  Add Guide
                </h2>
              </div>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setError("");
                }}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {renderGuideForm(false)}
          </div>
        </div>
      )}

      {/* Edit Guide Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Guide Management
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                  Edit Guide
                </h2>
              </div>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingGuide(null);
                  setError("");
                }}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {renderGuideForm(true)}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && renderReviewModal()}
    </div>
  );
}

export default Guides;
