import React, { useEffect, useState } from 'react';
import ActivityCard from '../components/activity/ActivityCard';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ItineraryTimeline from '../components/activity/ItineraryTimeline';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../constants';

export default function Activities() {
    // 1. Data State
    const [activities, setActivities] = useState([]);
    const [itinerary, setItinerary] = useState([]);

    // 2. Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [budgetFilter, setBudgetFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');

    // 3. Dynamic Dropdown Options
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [uniqueLocations, setUniqueLocations] = useState([]);

    useEffect(() => {
        // Fetch Activities
        fetch(`${BACKEND_URL}/api/activities`)
            .then(res => res.json())
            .then(data => {
                setActivities(data);

                // Automatically find all Categories & Locations from DB
                const cats = [...new Set(data.map(item => item.category))].filter(Boolean).sort();
                const locs = [...new Set(data.map(item => item.location))].filter(Boolean).sort();
                setUniqueCategories(cats);
                setUniqueLocations(locs);
            });

        // Fetch Itinerary
        fetch(`${BACKEND_URL}/api/itinerary`)
            .then(res => res.json())
            .then(data => setItinerary(data));
    }, []);

    // 4. The Filtering Engine
    const filteredActivities = activities.filter((activity) => {
        // A. Search Logic
        const query = searchQuery.trim().toLowerCase();
        const haystack = [
            activity?.title,
            activity?.category,
            activity?.location,
            activity?.summary,
        ].filter(Boolean).join(' ').toLowerCase();
        const matchesSearch = haystack.includes(query);

        // B. Dropdown Logic
        const matchesCategory = categoryFilter === 'All' || activity.category === categoryFilter;
        const matchesLocation = locationFilter === 'All' || activity.location === locationFilter;

        // C. Budget Logic
        const price = parseFloat(activity.price || 0);
        let matchesBudget = true;
        if (budgetFilter === 'Free') matchesBudget = price === 0;
        else if (budgetFilter === 'Low') matchesBudget = price > 0 && price <= 20;
        else if (budgetFilter === 'Medium') matchesBudget = price > 20 && price <= 60;
        else if (budgetFilter === 'High') matchesBudget = price > 60;

        return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
    });

    return (
        <div className="w-full px-6 py-6">
            <div className="mx-auto w-full max-w-6xl">

                {/* Header & Search */}
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full max-w-xl items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                        <SearchIcon fontSize="small" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search activities..."
                            className="w-full bg-transparent text-sm outline-none"
                        />
                    </div>
                    <button type="button" className="inline-flex w-fit items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
                            <FavoriteIcon sx={{ fontSize: 16 }} />
                        </span>
                        <span>Itinerary ({itinerary.length})</span>
                    </button>
                </div>

                {/* --- TOP SECTION: RETAINED STRUCTURE --- */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-6 sm:grid-cols-2">
                    <div className="lg:col-span-3 h-fit">
                        <h2 className="text-lg font-semibold mb-3">Featured Section</h2>
                        {activities[0] ? (
                            <ActivityCard key={activities[0].id} activity={activities[0]} featured />
                        ) : (
                            <div className="p-10 text-center text-gray-500 bg-gray-50 rounded-xl">
                                No activities found.
                            </div>
                        )}
                    </div>

                    {/* RESTORED: Your original testing itinerary code */}
                    <div className='lg:col-span-3' style={{ maxHeight: '600px', overflowY: 'hidden' }}>
                        <h2 className="text-lg font-semibold mb-3">Itinerary</h2>
                        {itinerary ? (<ItineraryTimeline itinerary={itinerary} />) :
                            <div className='flex justify-center items-center flex-col w-full!'>
                                <p className='pb-3 font-bold text-xl'>No current itinerary</p>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to={`/planner`}
                                    sx={{ bgcolor: '#0d9488', borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Generate an itinerary
                                </Button>
                            </div>
                        }
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>

                    <select
                        value={budgetFilter}
                        onChange={(e) => setBudgetFilter(e.target.value)}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm outline-none cursor-pointer"
                    >
                        <option value="All">Budget: All</option>
                        <option value="Free">Free</option>
                        <option value="Low">Low ($1-20)</option>
                        <option value="Medium">Medium ($20-60)</option>
                        <option value="High">High ($60+)</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm outline-none cursor-pointer"
                    >
                        <option value="All">Category: All</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm outline-none cursor-pointer"
                    >
                        <option value="All">Location: All</option>
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* --- GRID SECTION: ONLY uses filteredActivities --- */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} compact />
                    ))}
                </div>
            </div>
        </div>
    );
}