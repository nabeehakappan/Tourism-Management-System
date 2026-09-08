import React, { useEffect, useState, useCallback, useMemo } from "react";
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
    Languages,
} from "lucide-react";

const API = "http://localhost:5000/api";

// ==================================================
// USER
// ==================================================

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("traveliaUser") || "null");
    } catch {
        return null;
    }
}

// ==================================================
// DATE HELPERS
// ==================================================

function formatDateForApi(dateValue) {
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

function formatReviewDate(dateValue) {
    const normalized = formatDateForApi(dateValue);

    if (!normalized) {
        return "No date";
    }

    const [year, month, day] = normalized.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);

    return localDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// ==================================================
// COMPONENT
// ==================================================

export default function Guides() {
    const [currentUser] = useState(getStoredUser);
    const isAdmin = currentUser?.role === "ADMIN";

    // ==================================================
    // DATA
    // ==================================================

    const [guides, setGuides] = useState([]);
    const [packages, setPackages] = useState([]);
    const [tourists, setTourists] = useState([]);
    const [reviewsByGuide, setReviewsByGuide] = useState({});
    const [languagesByGuide, setLanguagesByGuide] = useState({});

    // ==================================================
    // SEARCH / MENUS
    // ==================================================

    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState(null);

    // ==================================================
    // MODALS
    // ==================================================

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // ==================================================
    // SELECTED ITEMS
    // ==================================================

    const [editingGuide, setEditingGuide] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [selectedLanguageGuide, setSelectedLanguageGuide] = useState(null);
    const [editingReview, setEditingReview] = useState(null);

    // ==================================================
    // REVIEW UI
    // ==================================================

    const [showEditReviewForm, setShowEditReviewForm] = useState(false);

    // ==================================================
    // LANGUAGE
    // ==================================================

    const [languageInput, setLanguageInput] = useState("");

    // ==================================================
    // LOADING / ERROR
    // ==================================================

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // ==================================================
    // GUIDE FORM
    // ==================================================

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        experienceYears: "",
    });

    // ==================================================
    // REVIEW FORM
    // ==================================================

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
    // FETCH GUIDES
    // ==================================================

    const fetchGuides = useCallback(async () => {
        try {
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

            await Promise.all([
                fetchReviewsForGuides(guideData),
                fetchLanguagesForGuides(guideData),
            ]);
        } catch (err) {
            console.error("Error fetching guides:", err);
            setError(err.response?.data?.message || "Unable to load guides.");
        }
    }, []);

    // ==================================================
    // FETCH PACKAGES
    // ==================================================

    const fetchPackages = useCallback(async () => {
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
    }, []);

    // ==================================================
    // FETCH TOURISTS
    // ==================================================

    const fetchTourists = useCallback(async () => {
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
    }, []);

    // ==================================================
    // FETCH REVIEWS FOR ALL GUIDES
    // ==================================================

    const fetchReviewsForGuides = useCallback(async (guideList) => {
        try {
            const results = await Promise.all(
                guideList.map(async (guide) => {
                    try {
                        const response = await axios.get(`${API}/reviews/${guide.id}`);

                        // Backend returns: [ROWID, Guide_ID, Review_Text, Review_Date, Rating]
                        const reviews = response.data.map((row) => ({
                            rowId: row[0],
                            guideId: Number(row[1]),
                            reviewText: row[2],
                            reviewDate: row[3],
                            rating: Number(row[4]),
                        }));

                        return { guideId: guide.id, reviews };
                    } catch (err) {
                        console.error(`Error fetching reviews for guide ${guide.id}:`, err);
                        return { guideId: guide.id, reviews: [] };
                    }
                })
            );

            const reviewMap = {};
            results.forEach(({ guideId, reviews }) => {
                reviewMap[guideId] = reviews;
            });

            setReviewsByGuide(reviewMap);
        } catch (err) {
            console.error("Error fetching guide reviews:", err);
        }
    }, []);

    // ==================================================
    // FETCH LANGUAGES FOR ALL GUIDES
    // ==================================================

    const fetchLanguagesForGuides = useCallback(async (guideList) => {
        try {
            const results = await Promise.all(
                guideList.map(async (guide) => {
                    try {
                        const response = await axios.get(`${API}/guides/${guide.id}/languages`);
                        const languages = response.data.map((row) => row[1]);
                        return { guideId: guide.id, languages };
                    } catch (err) {
                        console.error(`Error fetching languages for guide ${guide.id}:`, err);
                        return { guideId: guide.id, languages: [] };
                    }
                })
            );

            const languageMap = {};
            results.forEach(({ guideId, languages }) => {
                languageMap[guideId] = languages;
            });

            setLanguagesByGuide(languageMap);
        } catch (err) {
            console.error("Error fetching languages:", err);
        }
    }, []);

    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {
        fetchGuides();
        fetchPackages();
        fetchTourists();
    }, [fetchGuides, fetchPackages, fetchTourists]);

    // ==================================================
    // HELPERS
    // ==================================================

    const getGuidePackages = useCallback((guideId) => {
        return packages.filter((pkg) => pkg.guideId === guideId);
    }, [packages]);

    const getGuideTourists = useCallback((guideId) => {
        return tourists.filter((tourist) => tourist.guideId === guideId);
    }, [tourists]);

    const getPrimaryPackage = useCallback((guideId) => {
        const guidePackages = getGuidePackages(guideId);
        return guidePackages.length > 0 ? guidePackages[0] : null;
    }, [getGuidePackages]);

    const getGuideReviews = useCallback((guideId) => {
        return reviewsByGuide[guideId] || [];
    }, [reviewsByGuide]);

    const getGuideLanguages = useCallback((guideId) => {
        return languagesByGuide[guideId] || [];
    }, [languagesByGuide]);

    const getGuideRating = useCallback((guideId) => {
        const reviews = getGuideReviews(guideId);

        if (reviews.length === 0) {
            return null;
        }

        const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
        return total / reviews.length;
    }, [getGuideReviews]);

    // ==================================================
    // SEARCH
    // ==================================================

    const filteredGuides = useMemo(() => {
        return guides.filter((guide) => {
            const fullName = `${guide.firstName || ""} ${guide.lastName || ""}`.toLowerCase();
            const searchValue = search.toLowerCase();
            const languages = getGuideLanguages(guide.id).join(" ").toLowerCase();

            return (
                fullName.includes(searchValue) ||
                String(guide.id).includes(searchValue) ||
                String(guide.email || "").toLowerCase().includes(searchValue) ||
                String(guide.phone || "").includes(searchValue) ||
                languages.includes(searchValue)
            );
        });
    }, [guides, search, getGuideLanguages]);

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

            const nextGuideId = guides.length > 0
                ? Math.max(...guides.map((guide) => Number(guide.id))) + 1
                : 101;

            await axios.post(`${API}/guides`, {
                guideId: nextGuideId,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phoneNo: form.phone.trim(),
                email: form.email.trim(),
                experienceYears: Number(form.experienceYears),
            });

            setShowAddModal(false);
            resetGuideForm();

            await fetchGuides();
        } catch (err) {
            console.error("Error adding guide:", err.response?.data || err);
            setError(err.response?.data?.message || "Unable to add guide.");
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // OPEN EDIT GUIDE
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

        setError("");
        setOpenMenu(null);
        setShowEditModal(true);
    };

    // ==================================================
    // EDIT GUIDE
    // ==================================================

    const handleEditGuide = async (e) => {
        e.preventDefault();

        if (!isAdmin || !editingGuide) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            await axios.put(`${API}/guides/${editingGuide.id}`, {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phoneNo: form.phone.trim(),
                email: form.email.trim(),
                experienceYears: Number(form.experienceYears),
            });

            setShowEditModal(false);
            setEditingGuide(null);
            resetGuideForm();

            await fetchGuides();
        } catch (err) {
            console.error("Error updating guide:", err.response?.data || err);
            setError(err.response?.data?.message || "Unable to update guide.");
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

            await Promise.all([
                fetchGuides(),
                fetchPackages(),
                fetchTourists(),
            ]);
        } catch (err) {
            console.error("Error deleting guide:", err.response?.data || err);
            setError(
                err.response?.data?.message ||
                "Unable to delete guide. The guide may still be referenced by packages or tourists."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // OPEN REVIEWS
    // ==================================================

    const openReviews = async (guide) => {
        setSelectedGuide(guide);
        setShowReviewModal(true);
        setShowEditReviewForm(false);
        setEditingReview(null);
        setError("");

        await refreshGuideReviews(guide.id);
    };

    // ==================================================
    // REFRESH REVIEWS
    // ==================================================

    const refreshGuideReviews = useCallback(async (guideId) => {
        try {
            const response = await axios.get(`${API}/reviews/${guideId}`);

            // Backend returns: [ROWID, Guide_ID, Review_Text, Review_Date, Rating]
            const reviews = response.data.map((row) => ({
                rowId: row[0],
                guideId: Number(row[1]),
                reviewText: row[2],
                reviewDate: row[3],
                rating: Number(row[4]),
            }));

            setReviewsByGuide((prev) => ({
                ...prev,
                [guideId]: reviews,
            }));
        } catch (err) {
            console.error("Error refreshing reviews:", err);
            setError("Unable to load reviews.");
        }
    }, []);

    // ==================================================
    // REVIEW FORM CHANGE
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
    // ADD REVIEW
    // ==================================================

    const handleAddReview = async (e) => {
        e.preventDefault();

        if (!isAdmin || !selectedGuide) {
            return;
        }

        const reviewDate = formatDateForApi(reviewForm.reviewDate);
        const rating = Number(reviewForm.rating);

        if (!reviewDate) {
            setError("Please select a valid review date.");
            return;
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            setError("Please select a rating from 1 to 5.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await axios.post(`${API}/reviews/${selectedGuide.id}`, {
                reviewText: reviewForm.reviewText.trim(),
                reviewDate,
                rating,
            });

            resetReviewForm();

            await refreshGuideReviews(selectedGuide.id);
        } catch (err) {
            console.error("Error adding review:", err.response?.data || err);
            setError(err.response?.data?.message || "Unable to add review.");
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
            reviewDate: formatDateForApi(review.reviewDate),
            rating: String(review.rating || ""),
        });

        setShowEditReviewForm(true);
        setError("");
    };

    // ==================================================
    // UPDATE REVIEW - FIXED to use ROWID
    // ==================================================

    const handleEditReview = async (e) => {
        e.preventDefault();

        if (!isAdmin || !selectedGuide || !editingReview) {
            return;
        }

        const newReviewDate = formatDateForApi(editReviewForm.reviewDate);
        const newRating = Number(editReviewForm.rating);

        if (!newReviewDate) {
            setError("Please select a valid review date.");
            return;
        }

        if (!Number.isInteger(newRating) || newRating < 1 || newRating > 5) {
            setError("Please select a rating from 1 to 5.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            // Use ROWID to identify the review
            await axios.put(`${API}/reviews/${selectedGuide.id}`, {
                reviewRowId: editingReview.rowId,
                reviewText: editReviewForm.reviewText.trim(),
                reviewDate: newReviewDate,
                rating: newRating,
            });

            setShowEditReviewForm(false);
            setEditingReview(null);

            await refreshGuideReviews(selectedGuide.id);
        } catch (err) {
            console.error("Error updating review:", err.response?.data || err);
            setError(err.response?.data?.message || "Unable to update review.");
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // DELETE REVIEW - FIXED to use ROWID
    // ==================================================

    const handleDeleteReview = async (review) => {
        if (!isAdmin || !selectedGuide) {
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            // Use ROWID to identify the review
            await axios.delete(`${API}/reviews/${selectedGuide.id}`, {
                data: {
                    reviewRowId: review.rowId,
                },
            });

            if (editingReview && editingReview.rowId === review.rowId) {
                setEditingReview(null);
                setShowEditReviewForm(false);
            }

            await refreshGuideReviews(selectedGuide.id);
        } catch (err) {
            console.error("Error deleting review:", err.response?.data || err);
            setError(err.response?.data?.message || "Unable to delete review.");
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // LANGUAGE MODAL
    // ==================================================

    const openLanguageModal = async (guide) => {
        setSelectedLanguageGuide(guide);
        setLanguageInput("");
        setError("");
        setOpenMenu(null);
        setShowLanguageModal(true);

        try {
            const response = await axios.get(`${API}/guides/${guide.id}/languages`);
            const languages = response.data.map((row) => row[1]);

            setLanguagesByGuide((prev) => ({
                ...prev,
                [guide.id]: languages,
            }));
        } catch (err) {
            console.error("Error fetching languages:", err);
            setError("Unable to load languages.");
        }
    };

    // ==================================================
    // ADD LANGUAGE
    // ==================================================

    const handleAddLanguage = async (e) => {
        e.preventDefault();

        if (!isAdmin || !selectedLanguageGuide) {
            return;
        }

        const language = languageInput.trim();

        if (!language) {
            setError("Please enter a language.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await axios.post(`${API}/guides/${selectedLanguageGuide.id}/languages`, {
                language,
            });

            setLanguageInput("");

            const response = await axios.get(`${API}/guides/${selectedLanguageGuide.id}/languages`);
            const languages = response.data.map((row) => row[1]);

            setLanguagesByGuide((prev) => ({
                ...prev,
                [selectedLanguageGuide.id]: languages,
            }));
        } catch (err) {
            console.error("Error adding language:", err.response?.data || err);
            setError(err.response?.data?.message || "Unable to add language.");
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // DELETE LANGUAGE
    // ==================================================

    const handleDeleteLanguage = async (guide, language) => {
        if (!isAdmin) return;

        const confirmed = window.confirm(
            `Remove ${language} from ${guide.firstName} ${guide.lastName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            await axios.delete(`${API}/guides/${guide.id}/languages/${encodeURIComponent(language)}`);

            const response = await axios.get(`${API}/guides/${guide.id}/languages`);
            const languages = response.data.map((row) => row[1]);

            setLanguagesByGuide((prev) => ({
                ...prev,
                [guide.id]: languages,
            }));

            if (selectedLanguageGuide?.id === guide.id) {
                setSelectedLanguageGuide(guide);
            }
        } catch (err) {
            console.error("Error deleting language:", err.response?.data || err);
            setError(err.response?.data?.message || "Unable to delete language.");
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // CLOSE MODALS
    // ==================================================

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedGuide(null);
        setEditingReview(null);
        setShowEditReviewForm(false);
        resetReviewForm();
        setError("");
    };

    const closeLanguageModal = () => {
        setShowLanguageModal(false);
        setSelectedLanguageGuide(null);
        setLanguageInput("");
        setError("");
    };

    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="min-h-screen bg-[#faf9f6] p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-gray-900">
                            Guides
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your tour guides, languages and reviews.
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

                {/* ERROR */}
                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span>{error}</span>
                        <button onClick={() => setError("")} className="ml-4">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* SEARCH */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search guides, email, phone or language..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400"
                        />
                    </div>
                </div>

                {/* GUIDE GRID */}
                {filteredGuides.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                        <p className="text-sm text-gray-500">No guides found.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredGuides.map((guide) => {
                            const primaryPackage = getPrimaryPackage(guide.id);
                            const guideTourists = getGuideTourists(guide.id);
                            const guideReviews = getGuideReviews(guide.id);
                            const guideLanguages = getGuideLanguages(guide.id);
                            const guideRating = getGuideRating(guide.id);

                            return (
                                <div
                                    key={guide.id}
                                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* MENU */}
                                    <div className="absolute right-4 top-4 z-20">
                                        <button
                                            onClick={() =>
                                                setOpenMenu(openMenu === guide.id ? null : guide.id)
                                            }
                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                                        >
                                            <MoreHorizontal size={19} />
                                        </button>

                                        {openMenu === guide.id && (
                                            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                                                {isAdmin ? (
                                                    <>
                                                        <button
                                                            onClick={() => openEditGuide(guide)}
                                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <Pencil size={16} />
                                                            Edit Guide
                                                        </button>
                                                        <button
                                                            onClick={() => openLanguageModal(guide)}
                                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <Languages size={16} />
                                                            Manage Languages
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteGuide(guide)}
                                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Guide
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => openLanguageModal(guide)}
                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Languages size={16} />
                                                        View Languages
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* GUIDE INFO */}
                                    <div className="p-6">
                                        <div className="mb-5 flex items-start gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 font-serif text-xl font-semibold text-gray-700">
                                                {guide.firstName?.[0]}
                                                {guide.lastName?.[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="truncate pr-8 font-serif text-xl font-semibold text-gray-900">
                                                    {guide.firstName} {guide.lastName}
                                                </h2>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    Guide ID: {guide.id}
                                                </p>
                                            </div>
                                        </div>

                                        {/* CONTACT */}
                                        <div className="space-y-2.5 border-b border-gray-100 pb-5">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Phone size={16} className="text-gray-400" />
                                                <span>{guide.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Mail size={16} className="text-gray-400" />
                                                <span className="truncate">{guide.email}</span>
                                            </div>
                                        </div>

                                        {/* DETAILS */}
                                        <div className="grid grid-cols-2 gap-3 py-5">
                                            <div className="rounded-xl bg-gray-50 p-3">
                                                <p className="text-xs text-gray-400">Experience</p>
                                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                                    {guide.experienceYears} years
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-gray-50 p-3">
                                                <p className="text-xs text-gray-400">Tourists</p>
                                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                                    {guideTourists.length}
                                                </p>
                                            </div>
                                        </div>

                                        {/* PACKAGE */}
                                        {primaryPackage && (
                                            <div className="mb-4 rounded-xl border border-gray-100 p-4">
                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                    Assigned Package
                                                </p>
                                                <p className="mt-1 font-medium text-gray-800">
                                                    {primaryPackage.name}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {primaryPackage.destination}
                                                </p>
                                            </div>
                                        )}

                                        {/* LANGUAGES */}
                                        <div className="mb-4 rounded-xl border border-gray-100 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Languages size={15} className="text-gray-400" />
                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        Languages
                                                    </p>
                                                </div>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => openLanguageModal(guide)}
                                                        className="text-xs font-medium text-gray-700 hover:text-gray-900"
                                                    >
                                                        + Add
                                                    </button>
                                                )}
                                            </div>

                                            {guideLanguages.length === 0 ? (
                                                <p className="text-sm text-gray-400">No languages added.</p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {guideLanguages.map((language) => (
                                                        <span
                                                            key={language}
                                                            className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                                                        >
                                                            {language}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* RATING */}
                                        <button
                                            onClick={() => openReviews(guide)}
                                            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Star
                                                    size={17}
                                                    className="fill-yellow-400 text-yellow-400"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {guideRating !== null
                                                        ? guideRating.toFixed(1)
                                                        : "No rating"}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {guideReviews.length}{" "}
                                                {guideReviews.length === 1 ? "review" : "reviews"}
                                            </span>
                                        </button>

                                        {/* REVIEWS */}
                                        <button
                                            onClick={() => openReviews(guide)}
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                                        >
                                            <MessageSquareText size={17} />
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
                                <p className="mt-1 text-sm text-gray-500">Add a new tour guide.</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handleAddGuide} className="space-y-4 p-6">
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
                                    value={form.experienceYears}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {saving ? "Adding..." : "Add Guide"}
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
                                <p className="mt-1 text-sm text-gray-500">Update guide details.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingGuide(null);
                                }}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handleEditGuide} className="space-y-4 p-6">
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
                                    value={form.experienceYears}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingGuide(null);
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
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================
                LANGUAGE MODAL
            ========================================================= */}
            {showLanguageModal && selectedLanguageGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div>
                                <h2 className="font-serif text-xl font-semibold text-gray-900">
                                    Languages
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {selectedLanguageGuide.firstName} {selectedLanguageGuide.lastName}
                                </p>
                            </div>
                            <button
                                onClick={closeLanguageModal}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="p-6">
                            {error && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="mb-6">
                                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Current Languages
                                </p>

                                {getGuideLanguages(selectedLanguageGuide.id).length === 0 ? (
                                    <p className="text-sm text-gray-400">No languages added yet.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {getGuideLanguages(selectedLanguageGuide.id).map((language) => (
                                            <div
                                                key={language}
                                                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                                            >
                                                <span>{language}</span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteLanguage(selectedLanguageGuide, language)
                                                        }
                                                        disabled={saving}
                                                        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isAdmin && (
                                <form onSubmit={handleAddLanguage} className="border-t border-gray-100 pt-6">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Add Language
                                    </label>
                                    <input
                                        type="text"
                                        value={languageInput}
                                        onChange={(e) => setLanguageInput(e.target.value)}
                                        placeholder="e.g. Hindi"
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    />
                                    <div className="mt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeLanguageModal}
                                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            {saving ? "Adding..." : "Add Language"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {!isAdmin && (
                                <div className="flex justify-end border-t border-gray-100 pt-6">
                                    <button
                                        onClick={closeLanguageModal}
                                        className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                REVIEW MODAL
            ========================================================= */}
            {showReviewModal && selectedGuide && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
                    <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div>
                                <h2 className="font-serif text-xl font-semibold text-gray-900">
                                    Reviews for {selectedGuide.firstName} {selectedGuide.lastName}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {getGuideReviews(selectedGuide.id).length} reviews
                                </p>
                            </div>
                            <button
                                onClick={closeReviewModal}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* ERROR */}
                            {error && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* EXISTING REVIEWS */}
                            {getGuideReviews(selectedGuide.id).length === 0 ? (
                                <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center">
                                    <MessageSquareText size={28} className="mx-auto text-gray-300" />
                                    <p className="mt-3 text-sm text-gray-500">No reviews yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {getGuideReviews(selectedGuide.id).map((review, index) => (
                                        <div
                                            key={`${review.rowId}-${index}`}
                                            className="rounded-xl border border-gray-200 p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    {/* STARS */}
                                                    <div className="mb-2 flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                size={15}
                                                                className={
                                                                    star <= Number(review.rating)
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                }
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* TEXT */}
                                                    <p className="text-sm leading-6 text-gray-700">
                                                        {review.reviewText}
                                                    </p>

                                                    {/* DATE */}
                                                    <p className="mt-3 text-xs text-gray-400">
                                                        {formatReviewDate(review.reviewDate)}
                                                    </p>
                                                </div>

                                                {/* ADMIN ACTIONS */}
                                                {isAdmin && (
                                                    <div className="flex shrink-0 items-center gap-1">
                                                        <button
                                                            onClick={() => openEditReview(review)}
                                                            disabled={saving}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                                                            title="Edit review"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReview(review)}
                                                            disabled={saving}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                            title="Delete review"
                                                        >
                                                            <Trash2 size={16} />
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
                                                setShowEditReviewForm(false);
                                                setEditingReview(null);
                                                setError("");
                                            }}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleEditReview} className="space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Review
                                            </label>
                                            <textarea
                                                name="reviewText"
                                                value={editReviewForm.reviewText}
                                                onChange={handleEditReviewFormChange}
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
                                                    value={editReviewForm.reviewDate}
                                                    onChange={handleEditReviewFormChange}
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
                                                    value={editReviewForm.rating}
                                                    onChange={handleEditReviewFormChange}
                                                    required
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
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

                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowEditReviewForm(false);
                                                    setEditingReview(null);
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
                                                {saving ? "Saving..." : "Save Review"}
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
                                    <form onSubmit={handleAddReview} className="space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Review
                                            </label>
                                            <textarea
                                                name="reviewText"
                                                value={reviewForm.reviewText}
                                                onChange={handleReviewFormChange}
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
                                                    value={reviewForm.reviewDate}
                                                    onChange={handleReviewFormChange}
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
                                                    value={reviewForm.rating}
                                                    onChange={handleReviewFormChange}
                                                    required
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
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

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                {saving ? "Adding..." : "Add Review"}
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