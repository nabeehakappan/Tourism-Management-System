import { useEffect, useState } from "react";
import axios from "axios";
import {
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    X,
    Pencil,
    Trash2,
} from "lucide-react";

import { isAdmin } from "../utils/auth";

const API = "http://localhost:5000/api";

const emptyForm = {
    touristId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    guideId: "",
};

const formatDateForInput = (value) => {
    if (!value) return "";

    if (value instanceof Date && !isNaN(value.getTime())) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const stringValue = String(value).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
        return stringValue;
    }

    const parts = stringValue.split("-");

    if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const monthName = parts[1].toUpperCase();
        let year = parts[2];

        const months = {
            JAN: "01",
            FEB: "02",
            MAR: "03",
            APR: "04",
            MAY: "05",
            JUN: "06",
            JUL: "07",
            AUG: "08",
            SEP: "09",
            OCT: "10",
            NOV: "11",
            DEC: "12",
        };

        const month = months[monthName];

        if (month) {
            if (year.length === 2) {
                year =
                    Number(year) >= 50
                        ? `19${year}`
                        : `20${year}`;
            }

            return `${year}-${month}-${day}`;
        }
    }

    const parsedDate = new Date(stringValue);

    if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    return "";
};

export default function Tourists() {
    const admin = isAdmin();

    const [tourists, setTourists] = useState([]);
    const [guides, setGuides] = useState([]);
    const [phones, setPhones] = useState({});
    const [search, setSearch] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [editingTourist, setEditingTourist] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [openMenu, setOpenMenu] = useState(null);

    const fetchTourists = async () => {
        try {
            const response = await axios.get(`${API}/tourists`);
            const touristData = response.data;

            setTourists(touristData);

            const phoneResults = await Promise.all(
                touristData.map(async (tourist) => {
                    const touristId = tourist[0];

                    try {
                        const phoneResponse = await axios.get(
                            `${API}/tourists/${touristId}/phones`
                        );

                        const phoneRows = phoneResponse.data;

                        return [
                            touristId,
                            phoneRows.length > 0
                                ? phoneRows[0][1]
                                : "",
                        ];
                    } catch {
                        return [touristId, ""];
                    }
                })
            );

            const phoneMap = {};

            phoneResults.forEach(([touristId, phone]) => {
                phoneMap[touristId] = phone;
            });

            setPhones(phoneMap);
        } catch (err) {
            console.error(err);
            setError("Failed to load tourists.");
        }
    };

    const fetchGuides = async () => {
        try {
            const response = await axios.get(`${API}/guides`);
            setGuides(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTourists();
        fetchGuides();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddTourist = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !form.touristId ||
            !form.firstName ||
            !form.lastName ||
            !form.gender ||
            !form.dateOfBirth ||
            !form.nationality ||
            !form.email ||
            !form.city ||
            !form.state ||
            !form.pin
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setSaving(true);

            await axios.post(`${API}/tourists`, {
                touristId: Number(form.touristId),
                firstName: form.firstName.trim(),
                middleName: form.middleName.trim() || null,
                lastName: form.lastName.trim(),
                gender: form.gender,
                dateOfBirth: form.dateOfBirth,
                nationality: form.nationality.trim(),
                email: form.email.trim(),
                street: form.street.trim() || null,
                city: form.city.trim(),
                state: form.state.trim(),
                pin: form.pin.trim(),
                guideId: form.guideId
                    ? Number(form.guideId)
                    : null,
            });

            if (form.phone.trim()) {
                await axios.post(
                    `${API}/tourists/${Number(form.touristId)}/phones`,
                    {
                        phoneNo: form.phone.trim(),
                    }
                );
            }

            await fetchTourists();

            setForm(emptyForm);
            setShowAddModal(false);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                "Failed to add tourist."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEditTourist = (tourist) => {
        setEditingTourist(tourist);

        setForm({
            touristId: tourist[0] ?? "",
            firstName: tourist[1] ?? "",
            middleName: tourist[2] ?? "",
            lastName: tourist[3] ?? "",
            gender: tourist[4] ?? "",
            dateOfBirth: formatDateForInput(tourist[5]),
            nationality: tourist[6] ?? "",
            email: tourist[7] ?? "",
            street: tourist[8] ?? "",
            city: tourist[9] ?? "",
            state: tourist[10] ?? "",
            pin: tourist[11] ?? "",
            phone: phones[tourist[0]] ?? "",
            guideId: tourist[12] ?? "",
        });

        setError("");
        setOpenMenu(null);
        setShowEditModal(true);
    };

    const handleUpdateTourist = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !form.firstName ||
            !form.lastName ||
            !form.gender ||
            !form.dateOfBirth ||
            !form.nationality ||
            !form.email ||
            !form.city ||
            !form.state ||
            !form.pin
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setSaving(true);

            const touristId = Number(form.touristId);

            await axios.put(`${API}/tourists/${touristId}`, {
                firstName: form.firstName.trim(),
                middleName: form.middleName.trim() || null,
                lastName: form.lastName.trim(),
                gender: form.gender,
                dateOfBirth: form.dateOfBirth,
                nationality: form.nationality.trim(),
                email: form.email.trim(),
                street: form.street.trim() || null,
                city: form.city.trim(),
                state: form.state.trim(),
                pin: form.pin.trim(),
                guideId: form.guideId
                    ? Number(form.guideId)
                    : null,
            });

            const oldPhone = phones[touristId] || "";
            const newPhone = form.phone.trim();

            if (oldPhone !== newPhone) {
                if (oldPhone) {
                    try {
                        await axios.delete(
                            `${API}/tourists/${touristId}/phones/${encodeURIComponent(
                                oldPhone
                            )}`
                        );
                    } catch (phoneDeleteError) {
                        console.error(
                            "Old phone deletion error:",
                            phoneDeleteError
                        );
                    }
                }

                if (newPhone) {
                    await axios.post(
                        `${API}/tourists/${touristId}/phones`,
                        {
                            phoneNo: newPhone,
                        }
                    );
                }
            }

            await fetchTourists();

            setForm(emptyForm);
            setEditingTourist(null);
            setShowEditModal(false);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                "Failed to update tourist."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTourist = async (tourist) => {
        const touristId = tourist[0];
        const touristName = `${tourist[1]} ${tourist[3]}`;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${touristName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await axios.delete(`${API}/tourists/${touristId}`);

            setOpenMenu(null);

            await fetchTourists();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                "Could not delete this tourist. They may have existing bookings."
            );

            setOpenMenu(null);
        }
    };

    const filteredTourists = tourists.filter((tourist) => {
        const touristId = tourist[0];
        const firstName = tourist[1] || "";
        const middleName = tourist[2] || "";
        const lastName = tourist[3] || "";
        const nationality = tourist[6] || "";
        const email = tourist[7] || "";
        const phone = phones[touristId] || "";

        const fullText = `
            ${touristId}
            ${firstName}
            ${middleName}
            ${lastName}
            ${nationality}
            ${email}
            ${phone}
        `.toLowerCase();

        return fullText.includes(search.toLowerCase());
    });

    const renderTouristForm = (isEdit = false) => (
        <form
            onSubmit={
                isEdit
                    ? handleUpdateTourist
                    : handleAddTourist
            }
            className="p-6"
        >
            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Tourist ID
                    </label>

                    <input
                        type="number"
                        name="touristId"
                        value={form.touristId}
                        onChange={handleFormChange}
                        disabled={isEdit}
                        required
                        className={`w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500 ${
                            isEdit
                                ? "bg-gray-100 text-gray-500"
                                : "bg-white"
                        }`}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        First Name *
                    </label>

                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Middle Name
                    </label>

                    <input
                        type="text"
                        name="middleName"
                        value={form.middleName}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Last Name *
                    </label>

                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Gender *
                    </label>

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Date of Birth *
                    </label>

                    <input
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Nationality *
                    </label>

                    <input
                        type="text"
                        name="nationality"
                        value={form.nationality}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email *
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
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
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Street
                    </label>

                    <input
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        City *
                    </label>

                    <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        State *
                    </label>

                    <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        PIN *
                    </label>

                    <input
                        type="text"
                        name="pin"
                        value={form.pin}
                        onChange={handleFormChange}
                        required
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Assigned Guide
                    </label>

                    <select
                        name="guideId"
                        value={form.guideId}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    >
                        <option value="">
                            No guide assigned
                        </option>

                        {guides.map((guide) => (
                            <option
                                key={guide[0]}
                                value={guide[0]}
                            >
                                {guide[1]} {guide[2]} — Guide #{guide[0]}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => {
                        if (isEdit) {
                            setShowEditModal(false);
                            setEditingTourist(null);
                        } else {
                            setShowAddModal(false);
                        }

                        setForm(emptyForm);
                        setError("");
                    }}
                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving
                        ? isEdit
                            ? "Saving..."
                            : "Adding..."
                        : isEdit
                        ? "Save Changes"
                        : "Add Tourist"}
                </button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-[#faf9f6]">

            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-gray-900">
                            Tourists
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your registered tourists
                        </p>
                    </div>

                    {/* ADMIN ONLY */}
                    {admin && (
                        <button
                            onClick={() => {
                                setForm(emptyForm);
                                setError("");
                                setShowAddModal(true);
                            }}
                            className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            <Plus size={18} />
                            Add Tourist
                        </button>
                    )}
                </div>
            </div>

            <div className="p-8">

                {error && !showAddModal && !showEditModal && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Search */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search tourists..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400"
                        />
                    </div>

                    <div className="text-sm text-gray-500">
                        {filteredTourists.length} tourists
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/70">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Tourist
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Contact
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Nationality
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Gender
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        City
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Guide
                                    </th>

                                    {/* Only show Actions column to ADMIN */}
                                    {admin && (
                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredTourists.map((tourist) => {
                                    const touristId = tourist[0];
                                    const firstName = tourist[1] || "";
                                    const middleName = tourist[2] || "";
                                    const lastName = tourist[3] || "";
                                    const gender = tourist[4] || "";
                                    const nationality = tourist[6] || "";
                                    const email = tourist[7] || "";
                                    const city = tourist[9] || "";
                                    const guideId = tourist[12];

                                    const guide = guides.find(
                                        (item) =>
                                            Number(item[0]) ===
                                            Number(guideId)
                                    );

                                    return (
                                        <tr
                                            key={touristId}
                                            className="transition hover:bg-gray-50/60"
                                        >
                                            <td className="px-6 py-5">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {firstName}{" "}
                                                        {middleName
                                                            ? `${middleName} `
                                                            : ""}
                                                        {lastName}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        #{touristId}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="space-y-1.5">

                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail
                                                            size={14}
                                                            className="text-gray-400"
                                                        />

                                                        {email}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone
                                                            size={14}
                                                            className="text-gray-400"
                                                        />

                                                        {phones[touristId] ||
                                                            "No phone"}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {nationality}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                    {gender}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {city}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {guide ? (
                                                    `${guide[1]} ${guide[2]}`
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>

                                            {/* ADMIN ONLY */}
                                            {admin && (
                                                <td className="px-6 py-5">
                                                    <div className="relative flex justify-end">

                                                        <button
                                                            onClick={() =>
                                                                setOpenMenu(
                                                                    openMenu ===
                                                                        touristId
                                                                        ? null
                                                                        : touristId
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                                        >
                                                            <MoreHorizontal
                                                                size={19}
                                                            />
                                                        </button>

                                                        {openMenu ===
                                                            touristId && (
                                                            <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">

                                                                <button
                                                                    onClick={() =>
                                                                        handleEditTourist(
                                                                            tourist
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                                                >
                                                                    <Pencil
                                                                        size={15}
                                                                    />
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteTourist(
                                                                            tourist
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                                                                >
                                                                    <Trash2
                                                                        size={15}
                                                                    />
                                                                    Delete
                                                                </button>

                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}

                                {filteredTourists.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={admin ? 7 : 6}
                                            className="px-6 py-12 text-center text-sm text-gray-400"
                                        >
                                            No tourists found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">

                        <p className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-medium text-gray-700">
                                {filteredTourists.length}
                            </span>{" "}
                            tourists
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                disabled
                                className="rounded-lg border border-gray-200 p-2 text-gray-300"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <button className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white">
                                1
                            </button>

                            <button
                                disabled
                                className="rounded-lg border border-gray-200 p-2 text-gray-300"
                            >
                                <ChevronRight size={16} />
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Add Tourist Modal — ADMIN ONLY */}
            {admin && showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-gray-900">
                                    Add Tourist
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Create a new tourist record
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setForm(emptyForm);
                                    setError("");
                                }}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {renderTouristForm(false)}
                    </div>
                </div>
            )}

            {/* Edit Tourist Modal — ADMIN ONLY */}
            {admin && showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-gray-900">
                                    Edit Tourist
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update tourist information
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingTourist(null);
                                    setForm(emptyForm);
                                    setError("");
                                }}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {renderTouristForm(true)}
                    </div>
                </div>
            )}
        </div>
    );
}
