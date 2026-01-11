import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';

export default function HistoryPage() {
    // --- MOCK DATA (Simulating your Database) ---
    const [history, setHistory] = useState([
        {
            bookingID: 101,
            activityName: "National Gallery Singapore",
            status: "PAID",
            description: "The crown jewel of Southeast Asian art housed in two iconic monuments.",
            formattedDate: "2025-12-28",
            noOfPax: 2,
            price: 20.00,
            activityPicUrl: "https://images.unsplash.com/photo-1569388330292-7a6a841cd2e9?q=80&w=400&auto=format&fit=crop"
        },
        {
            bookingID: 102,
            activityName: "Gardens by the Bay",
            status: "CONFIRMED",
            description: "Step into a futuristic wonderland of Supertrees and climate-controlled domes.",
            formattedDate: "2025-12-29",
            noOfPax: 3,
            price: 0.00, // Free activity example
            activityPicUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=400&auto=format&fit=crop"
        },
        {
            bookingID: 103,
            activityName: "Universal Studios Singapore",
            status: "PENDING",
            description: "Ride the movies at Southeast Asia’s only Hollywood movie theme park.",
            formattedDate: "2026-01-15",
            noOfPax: 1,
            price: 82.00,
            activityPicUrl: "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=400&auto=format&fit=crop"
        },
        {
            bookingID: 104,
            activityName: "Maxwell Food Centre",
            status: "PAID",
            description: "Indulge in legendary local flavors at Singapore’s most famous hawker center.",
            formattedDate: "2025-12-30",
            noOfPax: 4,
            price: 15.00,
            activityPicUrl: "https://plus.unsplash.com/premium_photo-1661601664878-085e78c89b88?q=80&w=400&auto=format&fit=crop"
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    // --- TEST ACTION: Remove Item locally ---
    const handleRemove = (bookingID) => {
        if (!window.confirm("Simulating Delete: Are you sure?")) return;
        
        // Remove from local list only (Visual test)
        setHistory(prev => prev.filter(item => item.bookingID !== bookingID));
    };

    // --- FILTER LOGIC ---
    const filteredHistory = history.filter(item => 
        item.activityName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full bg-gray-50 pb-10 font-sans">
            
            {/* --- RED HEADER (Matches Wireframe) --- */}
            <div className="w-full bg-[#d32f2f] py-8 text-center text-white shadow-md">
                <h1 className="text-3xl font-bold tracking-tight">My Activity History</h1>
                <p className="mt-2 text-sm text-red-100">Manage your past and upcoming bookings</p>
            </div>

            <div className="mx-auto mt-8 max-w-4xl px-4">

                {/* --- SEARCH BAR --- */}
                <div className="mb-8 flex justify-center">
                    <div className="flex w-full max-w-lg items-center rounded-full bg-white px-5 py-3 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-red-200 transition-all">
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

                {/* --- HISTORY LIST CARDS --- */}
                <div className="flex flex-col gap-5">
                    {filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-gray-300 p-12 text-gray-400">
                            <CalendarTodayIcon style={{ fontSize: 40, marginBottom: 10, opacity: 0.5 }} />
                            <p>No activities found.</p>
                        </div>
                    ) : (
                        filteredHistory.map((item) => (
                            <div 
                                key={item.bookingID} 
                                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm sm:flex-row border border-gray-100 hover:shadow-md transition-all duration-300"
                            >
                                <div className="relative h-48 w-full bg-gray-200 sm:h-auto sm:w-56 shrink-0 overflow-hidden">
                                    <img 
                                        src={item.activityPicUrl} 
                                        alt={item.activityName}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col justify-center p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                            {item.activityName}
                                        </h3>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border ${
                                            item.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                                            item.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    
                                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                            <CalendarTodayIcon style={{ fontSize: 14 }} className="text-teal-600" />
                                            <span className="font-medium">{item.formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                            <PeopleIcon style={{ fontSize: 14 }} className="text-teal-600" />
                                            <span className="font-medium">{item.noOfPax} Pax</span>
                                        </div>
                                        <div className="flex items-center px-2 py-1 text-teal-700 font-bold">
                                            Total: ${(item.price * item.noOfPax).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-row border-t border-gray-100 bg-gray-50 p-3 sm:w-36 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:bg-gray-50/50 gap-2 shrink-0">
                                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors shadow-sm">
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