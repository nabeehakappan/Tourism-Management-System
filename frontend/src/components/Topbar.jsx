import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Bell,
    ChevronDown,
    LogOut,
    User,
    CalendarDays,
    CreditCard,
    X,
} from "lucide-react";

import { getCurrentUser, logout } from "../utils/auth";

function Topbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [search, setSearch] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        const query = search.trim();

        if (!query) return;

        const lowerQuery = query.toLowerCase();

        if (
            lowerQuery.includes("tourist") ||
            lowerQuery.includes("customer")
        ) {
            navigate("/tourists");
        } else if (
            lowerQuery.includes("package") ||
            lowerQuery.includes("trip") ||
            lowerQuery.includes("destination")
        ) {
            navigate("/packages");
        } else if (
            lowerQuery.includes("booking") ||
            lowerQuery.includes("reservation")
        ) {
            navigate("/bookings");
        } else if (
            lowerQuery.includes("payment") ||
            lowerQuery.includes("revenue")
        ) {
            navigate("/payments");
        } else if (
            lowerQuery.includes("guide") ||
            lowerQuery.includes("guides")
        ) {
            navigate("/guides");
        } else if (
            lowerQuery.includes("dashboard") ||
            lowerQuery.includes("home")
        ) {
            navigate("/");
        } else {
            // Default to packages for an unknown search
            navigate("/packages");
        }

        setSearch("");
    };

    const handleLogout = () => {
        logout();
    };

    const getInitial = () => {
        if (!user?.username) return "U";

        return user.username.charAt(0).toUpperCase();
    };

    const getDisplayName = () => {
        if (!user?.username) return "User";

        return (
            user.username.charAt(0).toUpperCase() +
            user.username.slice(1)
        );
    };

    const getRoleLabel = () => {
        if (user?.role === "ADMIN") {
            return "Administrator";
        }

        return "User";
    };

    return (
        <header className="h-20 bg-[#F7F5F0] border-b border-[#E6E1D8] flex items-center justify-between px-8">

            {/* Search */}
            <form
                onSubmit={handleSearch}
                className="relative w-80"
            >
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99958E]"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search anything..."
                    className="w-full bg-white border border-[#E6E1D8] rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none focus:border-[#8B7355] transition"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#99958E] hover:text-[#1C1C1C]"
                    >
                        <X size={15} />
                    </button>
                )}
            </form>

            {/* Right side */}
            <div className="flex items-center gap-6">

                {/* Notifications */}
                <div
                    className="relative"
                    ref={notificationRef}
                >
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                        }}
                        className="relative text-[#77736D] hover:text-[#1C1C1C] transition"
                    >
                        <Bell
                            size={19}
                            strokeWidth={1.7}
                        />

                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#8B7355] rounded-full" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-10 w-80 bg-white border border-[#E6E1D8] shadow-lg z-50">

                            <div className="px-5 py-4 border-b border-[#E6E1D8] flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-[#1C1C1C]">
                                        Notifications
                                    </h3>

                                    <p className="text-xs text-[#99958E] mt-1">
                                        Recent activity
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setShowNotifications(false)
                                    }
                                    className="text-[#99958E] hover:text-[#1C1C1C]"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="divide-y divide-[#F0ECE5]">

                                <button
                                    onClick={() => {
                                        navigate("/bookings");
                                        setShowNotifications(false);
                                    }}
                                    className="w-full text-left px-5 py-4 hover:bg-[#FAF8F4] transition flex gap-3"
                                >
                                    <div className="w-8 h-8 bg-[#F0ECE5] flex items-center justify-center shrink-0">
                                        <CalendarDays
                                            size={15}
                                            className="text-[#8B7355]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#1C1C1C]">
                                            Check upcoming bookings
                                        </p>

                                        <p className="text-xs text-[#99958E] mt-1">
                                            View your booking activity
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        navigate("/payments");
                                        setShowNotifications(false);
                                    }}
                                    className="w-full text-left px-5 py-4 hover:bg-[#FAF8F4] transition flex gap-3"
                                >
                                    <div className="w-8 h-8 bg-[#F0ECE5] flex items-center justify-center shrink-0">
                                        <CreditCard
                                            size={15}
                                            className="text-[#8B7355]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-[#1C1C1C]">
                                            Review payment status
                                        </p>

                                        <p className="text-xs text-[#99958E] mt-1">
                                            Check pending and completed payments
                                        </p>
                                    </div>
                                </button>

                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div
                    className="relative"
                    ref={profileRef}
                >
                    <button
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-3 hover:opacity-80 transition"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#D8CFC1] flex items-center justify-center text-sm font-medium text-[#1C1C1C]">
                            {getInitial()}
                        </div>

                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-[#1C1C1C]">
                                {getDisplayName()}
                            </p>

                            <p className="text-xs text-[#77736D]">
                                {getRoleLabel()}
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className="text-[#99958E]"
                        />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-12 w-56 bg-white border border-[#E6E1D8] shadow-lg z-50">

                            <div className="px-4 py-4 border-b border-[#E6E1D8]">
                                <p className="text-sm font-medium text-[#1C1C1C]">
                                    {getDisplayName()}
                                </p>

                                <p className="text-xs text-[#77736D] mt-1">
                                    {user?.role || "USER"}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowProfile(false);
                                    navigate("/");
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#555] hover:bg-[#FAF8F4] transition"
                            >
                                <User size={16} />
                                Dashboard
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Topbar;
