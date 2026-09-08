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
    Star,
} from "lucide-react";

const API = "http://localhost:5000/api";

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("traveliaUser") || "null");
    } catch {
        return null;
    }
}

// ==================================================
// DATE HELPER
// ==================================================

function normalizeDate(dateValue) {
    if (!dateValue) return "";

    if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, "0");
        const day = String(dateValue.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const value = String(dateValue).trim();

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.substring(0, 10);
    }

    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    return "";
}

export default function Guides() {
    const [currentUser] = useState(getStoredUser);
    const isAdmin = currentUser?.role === "ADMIN";

    const [guides, setGuides] = useState([]);
    const [packages, setPackages] = useState([]);
    const [tourists, setTourists] = useState([]);
    const [reviewsByGuide, setReviewsByGuide] = useState({});

    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const [editingGuide, setEditingGuide] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState(null);

    const [editingReview, setEditingReview] = useState(null);
    const [showEditReviewForm, setShowEditReviewForm] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        experienceYears: "",
    });

    const [reviewForm, setReviewForm] = useState({
        reviewText: "",
        reviewDate: "",
        rating: "",
    });

    const [editReviewForm, setEditReviewForm] = useState({
        reviewText: "",
        reviewDate: "",
        rating: "",
    });

    // ==================================================
    // FETCH GUIDES + REVIEWS
    // ==================================================

    const fetchGuides = async () => {
        try {
            setError("");

            const response = await axios.get(`${API}/guides`);

            const guideData = response.data.map((row) => ({
                id: Number(row[0]),
                firstName: row[1],
                lastName: row[2],
                phone: row[3],
                email: row[4],
                experienceYears: row[5],
            }));

            setGuides(guideData);

            const reviewResults = await Promise.all(
                guideData.map(async (guide) => {
                    try {
                        const reviewResponse = await axios.get(
                            `${API}/reviews/${guide.id}`
                        );

                        const reviews = reviewResponse.data.map((review) => ({
                            reviewRowId: review[0],
                            guideId: Number(review[1]),
                            reviewText: review[2],
                            reviewDate: review[3],
                            rating: Number(review[4]),
                        }));

                        return {
                            guideId: guide.id,
                            reviews,
                        };
                    } catch (err) {
                        console.error(
                            `Error fetching reviews for guide ${guide.id}:`,
                            err
                        );

                        return {
                            guideId: guide.id,
                            reviews: [],
                        };
                    }
                })
            );

            const reviewMap = {};

            reviewResults.forEach(({ guideId, reviews }) => {
                reviewMap[guideId] = reviews;
            });

            setReviewsByGuide(reviewMap);
        } catch (err) {
            console.error("Error fetching guides:", err);
            setError("Unable to load guides.");
        }
    };

    // ==================================================
    // FETCH PACKAGES
    // ==================================================

    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${API}/packages`);

            const packageData = response.data.map((row) => ({
                id: Number(row[0]),
                name: row[1],
                destination: `${row[2]}, ${row[3]}, ${row[4]}`,
                duration: row[5],
                price: row[6],
                type: row[7],
                guideId: Number(row[8]),
            }));

            setPackages(packageData);
        } catch (err) {
            console.error("Error fetching packages:", err);
        }
    };

    // ==================================================
    // FETCH TOURISTS
    // ==================================================

    const fetchTourists = async () => {
        try {
            const response = await axios.get(`${API}/tourists`);

            const touristData = response.data.map((row) => ({
                id: Number(row[0]),
                firstName: row[1],
                middleName: row[2],
                lastName: row[3],
                guideId: row[9] ? Number(row[9]) : null,
            }));

            setTourists(touristData);
        } catch (err) {
            console.error("Error fetching tourists:", err);
        }
    };

    useEffect(() => {
        fetchGuides();
        fetchPackages();
        fetchTourists();
    }, []);

    // ==================================================
    // HELPERS
    // ==================================================

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

    const getGuideReviews = (guideId) => {
        return reviewsByGuide[guideId] || [];
    };

    const getGuideRating = (guideId) => {
        const reviews = getGuideReviews(guideId);

        if (reviews.length === 0) {
            return null;
        }

        const total = reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
        );

        return total / reviews.length;
    };

    const getGuideReviewCount = (guideId) => {
        return getGuideReviews(guideId).length;
    };

    const formatReviewDate = (date) => {
        if (!date) return "No date";

        try {
            const normalized = normalizeDate(date);

            const [year, month, day] = normalized.split("-");

            if (!year || !month || !day) {
                return String(date);
            }

            const localDate = new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );

            return localDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return String(date);
        }
    };

    // ==================================================
    // SEARCH
    // ==================================================

    const filteredGuides = guides.filter((guide) => {
        const fullName = `${guide.firstName || ""} ${
            guide.lastName || ""
        }`.toLowerCase();

        const searchValue = search.toLowerCase();

        return (
            fullName.includes(searchValue) ||
            String(guide.id).includes(searchValue) ||
            String(guide.email || "")
                .toLowerCase()
                .includes(searchValue) ||
            String(guide.phone || "").includes(searchValue)
        );
    });

    // ==================================================
    // GUIDE FORM
    // ==================================================

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetGuideForm = () => {
        setForm({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            experienceYears: "",
        });
    };

    // ==================================================
    // ADD GUIDE
    // ==================================================

    const handleAddGuide = async (e) => {
        e.preventDefault();

        if (!isAdmin) return;

        try {
            setSaving(true);
            setError("");

            await axios.post(`${API}/guides`, {
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                email: form.email,
                experienceYears: Number(form.experienceYears),
            });

            setShowAddModal(false);
            resetGuideForm();

            await fetchGuides();
        } catch (err) {
            console.error(
                "Error adding guide:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to add guide."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // EDIT GUIDE
    // ==================================================

    const openEditGuide = (guide) => {
        if (!isAdmin) return;

        setEditingGuide(guide);

        setForm({
            firstName: guide.firstName || "",
            lastName: guide.lastName || "",
            phone: guide.phone || "",
            email: guide.email || "",
            experienceYears: guide.experienceYears ?? "",
        });

        setShowEditModal(true);
        setOpenMenu(null);
        setError("");
    };

    const handleEditGuide = async (e) => {
        e.preventDefault();

        if (!isAdmin || !editingGuide) return;

        try {
            setSaving(true);
            setError("");

            await axios.put(`${API}/guides/${editingGuide.id}`, {
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                email: form.email,
                experienceYears: Number(form.experienceYears),
            });

            setShowEditModal(false);
            setEditingGuide(null);
            resetGuideForm();

            await fetchGuides();
        } catch (err) {
            console.error(
                "Error updating guide:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update guide."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // DELETE GUIDE
    // ==================================================

    const handleDeleteGuide = async (guide) => {
        if (!isAdmin) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${guide.firstName} ${guide.lastName}?`
        );

        if (!confirmed) return;

        try {
            setSaving(true);
            setError("");

            await axios.delete(`${API}/guides/${guide.id}`);

            setOpenMenu(null);

            await fetchGuides();
            await fetchPackages();
            await fetchTourists();
        } catch (err) {
            console.error(
                "Error deleting guide:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to delete guide."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // REVIEW FORM
    // ==================================================

    const handleReviewFormChange = (e) => {
        const { name, value } = e.target;

        setReviewForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditReviewFormChange = (e) => {
        const { name, value } = e.target;

        setEditReviewForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetReviewForm = () => {
        setReviewForm({
            reviewText: "",
            reviewDate: "",
            rating: "",
        });
    };

    // ==================================================
    // OPEN REVIEWS
    // ==================================================

    const openReviews = (guide) => {
        setSelectedGuide(guide);
        setShowReviewModal(true);
        setShowEditReviewForm(false);
        setEditingReview(null);
        setError("");
    };

    // ==================================================
    // REFRESH GUIDE REVIEWS
    // ==================================================

    const refreshGuideReviews = async (guideId) => {
        try {
            const response = await axios.get(
                `${API}/reviews/${guideId}`
            );

            const reviews = response.data.map((review) => ({
                reviewRowId: review[0],
                guideId: Number(review[1]),
                reviewText: review[2],
                reviewDate: review[3],
                rating: Number(review[4]),
            }));

            setReviewsByGuide((prev) => ({
                ...prev,
                [guideId]: reviews,
            }));
        } catch (err) {
            console.error(
                "Error refreshing reviews:",
                err
            );
        }
    };

    // ==================================================
    // ADD REVIEW
    // ==================================================

    const handleAddReview = async (e) => {
        e.preventDefault();

        if (!isAdmin || !selectedGuide) return;

        try {
            setSaving(true);
            setError("");

            await axios.post(
                `${API}/reviews/${selectedGuide.id}`,
                {
                    reviewText: reviewForm.reviewText,
                    reviewDate: normalizeDate(
                        reviewForm.reviewDate
                    ),
                    rating: Number(reviewForm.rating),
                }
            );

            resetReviewForm();

            await refreshGuideReviews(selectedGuide.id);
        } catch (err) {
            console.error(
                "Error adding review:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to add review."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // OPEN EDIT REVIEW
    // ==================================================

    const openEditReview = (review) => {
        if (!isAdmin) return;

        setEditingReview(review);

        setEditReviewForm({
            reviewText: review.reviewText || "",
            reviewDate: normalizeDate(review.reviewDate),
            rating: String(review.rating || ""),
        });

        setShowEditReviewForm(true);
        setError("");
    };

    // ==================================================
    // UPDATE REVIEW
    // ==================================================

    const handleEditReview = async (e) => {
        e.preventDefault();

        if (!isAdmin || !selectedGuide || !editingReview) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            await axios.put(
                `${API}/reviews/${selectedGuide.id}`,
                {
                    oldReviewText: editingReview.reviewText,
                    oldReviewDate: normalizeDate(
                        editingReview.reviewDate
                    ),
                    oldRating: Number(editingReview.rating),

                    reviewText: editReviewForm.reviewText,
                    reviewDate: normalizeDate(
                        editReviewForm.reviewDate
                    ),
                    rating: Number(editReviewForm.rating),
                }
            );

            setShowEditReviewForm(false);
            setEditingReview(null);

            await refreshGuideReviews(selectedGuide.id);
        } catch (err) {
            console.error(
                "Error updating review:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update review."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // DELETE REVIEW
    // ==================================================

    const handleDeleteReview = async (review) => {
        if (!isAdmin || !selectedGuide) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) return;

        try {
            setSaving(true);
            setError("");

            /*
             * REVIEW is a weak entity.
             *
             * We do NOT create a Review_ID.
             *
             * The backend gives us Oracle ROWID for the
             * exact row, which lets us safely delete it.
             */

            if (!review.reviewRowId) {
                throw new Error(
                    "This review does not have a row identifier. Please refresh the page and try again."
                );
            }

            await axios.delete(
                `${API}/reviews/${selectedGuide.id}`,
                {
                    data: {
                        reviewRowId: review.reviewRowId,
                    },
                }
            );

            await refreshGuideReviews(selectedGuide.id);
        } catch (err) {
            console.error(
                "Error deleting review:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to delete review."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="min-h-screen bg-[#faf9f6] p-6 md:p-8">
            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-gray-900">
                            Guides
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your tour guides and their reviews.
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => {
                                resetGuideForm();
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

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span>{error}</span>

                        <button
                            onClick={() => setError("")}
                            className="ml-4"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search guides..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400"
                        />
                    </div>
                </div>

                {/* ==================================================
                    GUIDE GRID
                ================================================== */}

                {filteredGuides.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                        <p className="text-sm text-gray-500">
                            No guides found.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredGuides.map((guide) => {
                            const primaryPackage =
                                getPrimaryPackage(guide.id);

                            const guideTourists =
                                getGuideTourists(guide.id);

                            const guideReviews =
                                getGuideReviews(guide.id);

                            const guideRating =
                                getGuideRating(guide.id);

                            return (
                                <div
                                    key={guide.id}
                                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* ==================================================
                                        MENU
                                    ================================================== */}

                                    <div className="absolute right-4 top-4 z-10">
                                        <button
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu ===
                                                        guide.id
                                                        ? null
                                                        : guide.id
                                                )
                                            }
                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                                        >
                                            <MoreHorizontal
                                                size={19}
                                            />
                                        </button>

                                        {openMenu === guide.id && (
                                            <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                openEditGuide(
                                                                    guide
                                                                )
                                                            }
                                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <Pencil
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteGuide(
                                                                    guide
                                                                )
                                                            }
                                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* ==================================================
                                        GUIDE INFO
                                    ================================================== */}

                                    <div className="p-6">
                                        <div className="mb-5 flex items-start gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 font-serif text-xl font-semibold text-gray-700">
                                                {guide.firstName?.[0]}
                                                {guide.lastName?.[0]}
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="truncate pr-8 font-serif text-xl font-semibold text-gray-900">
                                                    {guide.firstName}{" "}
                                                    {guide.lastName}
                                                </h2>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Guide ID:{" "}
                                                    {guide.id}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ==================================================
                                            CONTACT
                                        ================================================== */}

                                        <div className="space-y-2.5 border-b border-gray-100 pb-5">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Phone
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                <span>
                                                    {guide.phone ||
                                                        "No phone"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Mail
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                <span className="truncate">
                                                    {guide.email ||
                                                        "No email"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ==================================================
                                            DETAILS
                                        ================================================== */}

                                        <div className="grid grid-cols-2 gap-3 py-5">
                                            <div className="rounded-xl bg-gray-50 p-3">
                                                <p className="text-xs text-gray-400">
                                                    Experience
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                                    {
                                                        guide.experienceYears
                                                    }{" "}
                                                    years
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-3">
                                                <p className="text-xs text-gray-400">
                                                    Tourists
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                                    {
                                                        guideTourists.length
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* ==================================================
                                            PACKAGE
                                        ================================================== */}

                                        {primaryPackage && (
                                            <div className="mb-5 rounded-xl border border-gray-100 p-4">
                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                    Assigned Package
                                                </p>

                                                <p className="mt-1 font-medium text-gray-800">
                                                    {
                                                        primaryPackage.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {
                                                        primaryPackage.destination
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* ==================================================
                                            RATING
                                        ================================================== */}

                                        <button
                                            onClick={() =>
                                                openReviews(guide)
                                            }
                                            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Star
                                                    size={17}
                                                    className="fill-yellow-400 text-yellow-400"
                                                />

                                                <span className="text-sm font-medium text-gray-700">
                                                    {guideRating !==
                                                    null
                                                        ? guideRating.toFixed(
                                                              1
                                                          )
                                                        : "No rating"}
                                                </span>
                                            </div>

                                            <span className="text-xs text-gray-400">
                                                {
                                                    guideReviews.length
                                                }{" "}
                                                {guideReviews.length ===
                                                1
                                                    ? "review"
                                                    : "reviews"}
                                            </span>
                                        </button>

                                        {/* ==================================================
                                            REVIEWS BUTTON
                                        ================================================== */}

                                        <button
                                            onClick={() =>
                                                openReviews(guide)
                                            }
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                                        >
                                            <MessageSquareText
                                                size={17}
                                            />
                                            View Reviews
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* =========================================================
                ADD GUIDE MODAL
            ========================================================= */}

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div>
                                <h2 className="font-serif text-xl font-semibold text-gray-900">
                                    Add Guide
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add a new tour guide.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddGuide}
                            className="space-y-4 p-6"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>

                                    <input
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>

                                    <input
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Experience Years
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="experienceYears"
                                    value={
                                        form.experienceYears
                                    }
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddModal(false)
                                    }
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Adding..."
                                        : "Add Guide"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================
                EDIT GUIDE MODAL
            ========================================================= */}

            {showEditModal && editingGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div>
                                <h2 className="font-serif text-xl font-semibold text-gray-900">
                                    Edit Guide
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update guide details.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowEditModal(false)
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleEditGuide}
                            className="space-y-4 p-6"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>

                                    <input
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>

                                    <input
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Experience Years
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="experienceYears"
                                    value={
                                        form.experienceYears
                                    }
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditModal(false)
                                    }
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================
                REVIEW MODAL
            ========================================================= */}

            {showReviewModal && selectedGuide && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
                    <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
                        {/* ==================================================
                            REVIEW HEADER
                        ================================================== */}

                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div>
                                <h2 className="font-serif text-xl font-semibold text-gray-900">
                                    Reviews for{" "}
                                    {selectedGuide.firstName}{" "}
                                    {selectedGuide.lastName}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {getGuideReviewCount(
                                        selectedGuide.id
                                    )}{" "}
                                    reviews
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setShowEditReviewForm(false);
                                    setEditingReview(null);
                                    setError("");
                                }}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* ==================================================
                                REVIEW ERROR
                            ================================================== */}

                            {error && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* ==================================================
                                EXISTING REVIEWS
                            ================================================== */}

                            {getGuideReviews(selectedGuide.id)
                                .length === 0 ? (
                                <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center">
                                    <MessageSquareText
                                        size={28}
                                        className="mx-auto text-gray-300"
                                    />

                                    <p className="mt-3 text-sm text-gray-500">
                                        No reviews yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {getGuideReviews(
                                        selectedGuide.id
                                    ).map((review, index) => (
                                        <div
                                            key={
                                                review.reviewRowId ||
                                                `${review.reviewText}-${review.reviewDate}-${review.rating}-${index}`
                                            }
                                            className="rounded-xl border border-gray-200 p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-2 flex items-center gap-1">
                                                        {[
                                                            1,
                                                            2,
                                                            3,
                                                            4,
                                                            5,
                                                        ].map(
                                                            (
                                                                star
                                                            ) => (
                                                                <Star
                                                                    key={
                                                                        star
                                                                    }
                                                                    size={
                                                                        15
                                                                    }
                                                                    className={
                                                                        star <=
                                                                        Number(
                                                                            review.rating
                                                                        )
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                    <p className="text-sm leading-6 text-gray-700">
                                                        {
                                                            review.reviewText
                                                        }
                                                    </p>

                                                    <p className="mt-3 text-xs text-gray-400">
                                                        {formatReviewDate(
                                                            review.reviewDate
                                                        )}
                                                    </p>
                                                </div>

                                                {isAdmin && (
                                                    <div className="flex shrink-0 items-center gap-1">
                                                        <button
                                                            onClick={() =>
                                                                openEditReview(
                                                                    review
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                                            title="Edit review"
                                                        >
                                                            <Pencil
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteReview(
                                                                    review
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                            title="Delete review"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ==================================================
                                EDIT REVIEW
                            ================================================== */}

                            {isAdmin && showEditReviewForm && (
                                <div className="mt-7 border-t border-gray-100 pt-7">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="font-serif text-lg font-semibold text-gray-900">
                                            Edit Review
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditReviewForm(
                                                    false
                                                );
                                                setEditingReview(
                                                    null
                                                );
                                            }}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={
                                            handleEditReview
                                        }
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Review
                                            </label>

                                            <textarea
                                                name="reviewText"
                                                value={
                                                    editReviewForm.reviewText
                                                }
                                                onChange={
                                                    handleEditReviewFormChange
                                                }
                                                required
                                                rows={4}
                                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                    Review Date
                                                </label>

                                                <input
                                                    type="date"
                                                    name="reviewDate"
                                                    value={
                                                        editReviewForm.reviewDate
                                                    }
                                                    onChange={
                                                        handleEditReviewFormChange
                                                    }
                                                    required
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                    Rating
                                                </label>

                                                <select
                                                    name="rating"
                                                    value={
                                                        editReviewForm.rating
                                                    }
                                                    onChange={
                                                        handleEditReviewFormChange
                                                    }
                                                    required
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                                                >
                                                    <option value="">
                                                        Select rating
                                                    </option>

                                                    <option value="5">
                                                        5 — Excellent
                                                    </option>

                                                    <option value="4">
                                                        4 — Very Good
                                                    </option>

                                                    <option value="3">
                                                        3 — Good
                                                    </option>

                                                    <option value="2">
                                                        2 — Fair
                                                    </option>

                                                    <option value="1">
                                                        1 — Poor
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowEditReviewForm(
                                                        false
                                                    );
                                                    setEditingReview(
                                                        null
                                                    );
                                                }}
                                                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                {saving
                                                    ? "Saving..."
                                                    : "Save Review"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ==================================================
                                ADD REVIEW
                            ================================================== */}

                            {isAdmin && !showEditReviewForm && (
                                <div className="mt-7 border-t border-gray-100 pt-7">
                                    <h3 className="mb-4 font-serif text-lg font-semibold text-gray-900">
                                        Add Review
                                    </h3>

                                    <form
                                        onSubmit={
                                            handleAddReview
                                        }
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Review
                                            </label>

                                            <textarea
                                                name="reviewText"
                                                value={
                                                    reviewForm.reviewText
                                                }
                                                onChange={
                                                    handleReviewFormChange
                                                }
                                                required
                                                rows={4}
                                                placeholder="Write a review..."
                                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                    Review Date
                                                </label>

                                                <input
                                                    type="date"
                                                    name="reviewDate"
                                                    value={
                                                        reviewForm.reviewDate
                                                    }
                                                    onChange={
                                                        handleReviewFormChange
                                                    }
                                                    required
                                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                    Rating
                                                </label>

                                                <select
                                                    name="rating"
                                                    value={
                                                        reviewForm.rating
                                                    }
                                                    onChange={
                                                        handleReviewFormChange
                                                    }
                                                    required
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                                                >
                                                    <option value="">
                                                        Select rating
                                                    </option>

                                                    <option value="5">
                                                        5 — Excellent
                                                    </option>

                                                    <option value="4">
                                                        4 — Very Good
                                                    </option>

                                                    <option value="3">
                                                        3 — Good
                                                    </option>

                                                    <option value="2">
                                                        2 — Fair
                                                    </option>

                                                    <option value="1">
                                                        1 — Poor
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                {saving
                                                    ? "Adding..."
                                                    : "Add Review"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}