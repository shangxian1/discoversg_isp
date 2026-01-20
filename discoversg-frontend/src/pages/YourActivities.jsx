import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import { CircularProgress } from '@mui/material';

export default function HistoryPage() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. Get Logged In User ID
    const user = (() => {
        try {
            return JSON.parse(sessionStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    })();

    // Support both shapes: { id } or { userID }
    const userId = Number(user?.id ?? user?.userID);

    const resolveImageUrl = (raw) => {
        const value = String(raw ?? '').trim();
        if (!value || value === '_') return 'https://placehold.co/600x400?text=No+Image';
        if (value.startsWith('http://') || value.startsWith('https://')) return value;
        if (value.startsWith('/assets/')) return value;
        if (value.startsWith('/')) return value;
        return `/assets/${value}`;
    };

    // 2. Fetch Real Data from Backend
    useEffect(() => {
        if (!Number.isInteger(userId) || userId <= 0) {
            setError('Please log in to view your paid activity history.');
            setLoading(false);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(`http://localhost:3000/api/bookings/paid/${userId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || 'Failed to load paid activity history');
                }

                if (!cancelled) setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!cancelled) setError(err?.message || 'Failed to load paid activity history');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    // 3. Remove Item Function (Connects to DB)
    const handleRemove = async (bookingID) => {
        if (!Number.isInteger(userId) || userId <= 0) {
            setError('Please log in to manage your history.');
            return;
        }

        if (!window.confirm('Remove this activity? If eligible, a refund will be requested.')) return;

        try {
            // 1) Try refund first (server enforces policy).
            const refundRes = await fetch('http://localhost:3000/api/payments/refund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, bookingId: bookingID }),
            });

            const refundData = await refundRes.json();

            if (refundRes.ok) {
                setHistory((prev) => prev.filter((item) => item.bookingID !== bookingID));
                return;
            }

            // 2) If refund isn't allowed, offer cancel/hide without refund.
            const refundError = refundData?.error || 'Refund not available.';
            const proceed = window.confirm(`${refundError}\n\nRemove from history without refund instead?`);
            if (!proceed) return;

            const cancelRes = await fetch('http://localhost:3000/api/bookings/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, bookingId: bookingID }),
            });

            const cancelData = await cancelRes.json();
            if (!cancelRes.ok) {
                throw new Error(cancelData?.error || 'Failed to remove booking');
            }

            setHistory((prev) => prev.filter((item) => item.bookingID !== bookingID));
        } catch (e) {
            setError(e?.message || 'Failed to remove booking');
        }
    };

    // 4. Filter Logic (Frontend Search)
    const filteredHistory = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return history;
        return history.filter((item) =>
            String(item?.activityName ?? '').toLowerCase().includes(q) ||
            String(item?.location ?? '').toLowerCase().includes(q)
        );
    }, [history, searchQuery]);

    return (
        <div className="min-h-screen w-full bg-gray-50 pb-10 font-sans">

            {/* Header */}
            <div className="w-full bg-[#d32f2f] py-8 text-center text-white shadow-md">
                <h1 className="text-3xl font-bold tracking-tight">My Activity History</h1>
                <p className="mt-2 text-sm text-red-100 opacity-90">Manage your past and upcoming bookings</p>
            </div>

            <div className="mx-auto mt-8 max-w-4xl px-4">

                {/* Search Bar */}
                <div className="mb-8 flex justify-center">
                    <div className="flex w-full max-w-lg items-center rounded-full bg-white px-5 py-3 shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-red-200">
                        <SearchIcon className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search your history..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="flex flex-col gap-5">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-gray-300 p-12 text-gray-500">
                            <CalendarTodayIcon style={{ fontSize: 40, marginBottom: 10, opacity: 0.5 }} />
                            <p>Loading your paid bookings…</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-gray-300 p-12 text-red-600">
                            <p className="font-semibold">{error}</p>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-gray-300 p-12 text-gray-400">
                            <CalendarTodayIcon style={{ fontSize: 40, marginBottom: 10, opacity: 0.5 }} />
                            <p>No paid activity history found.</p>
                        </div>
                    ) : (
                        filteredHistory.map((item) => (
                            <div
                                key={item.bookingID}
                                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm sm:flex-row border border-gray-100 hover:shadow-md transition-all duration-300"
                            >
                                {/* IMAGE */}
                                <div className="relative h-48 w-full bg-gray-200 sm:h-auto sm:w-56 shrink-0 overflow-hidden">
                                    <img
                                        src={resolveImageUrl(item.activityPicUrl)}
                                        alt={item.activityName}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image' }}
                                    />
                                </div>

                                {/* DETAILS */}
                                <div className="flex flex-1 flex-col justify-center p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                            {item.activityName}
                                        </h3>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border ${item.status === 'PAID' || item.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' :
                                            item.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                                        {item.description || item.summary || "No description available."}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                            <CalendarTodayIcon style={{ fontSize: 14 }} className="text-teal-600" />
                                            <span className="font-medium">{String(item.sessionDate ?? '').slice(0, 10)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                            <PeopleIcon style={{ fontSize: 14 }} className="text-teal-600" />
                                            <span className="font-medium">{item.noOfPax} Pax</span>
                                        </div>
                                        <div className="flex items-center px-2 py-1 text-teal-700 font-bold">
                                            Total: ${(Number(Number(item.price) || 0) * Number(item.noOfPax || 0)).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="flex w-full flex-row border-t border-gray-100 bg-gray-50 p-3 sm:w-36 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:bg-gray-50/50 gap-2 shrink-0">
                                    <button
                                        onClick={() => navigate(`/activity/${item.activityId}`)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors shadow-sm"
                                    >
                                        <VisibilityIcon style={{ fontSize: 16 }} />
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.bookingID)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                                    >
                                        <DeleteOutlineIcon style={{ fontSize: 16 }} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}