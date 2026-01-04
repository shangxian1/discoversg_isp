import React, { useEffect, useState } from 'react';
import ActivityCard from '../components/activity/ActivityCard';
import ItineraryCard from '../components/activity/ItineraryCard';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Activities() {
    const [activities, setActivities] = useState([]); // state that holds activities data
    const [itinerary, setItinerary] = useState([]); // state that holds itinerary data
    const [searchQuery, setSearchQuery] = useState('');

    const [budgetFilter, setBudgetFilter] = useState('Budget');
    const [categoryFilter, setCategoryFilter] = useState('Category');
    const [locationFilter, setLocationFilter] = useState('Location');

    useEffect(() => {
        fetch('http://localhost:3000/api/activities')
            .then(res => res.json())
            .then(data => {
                console.log('Activities from backend:', data);
                setActivities(data);
    });

        fetch('http://localhost:3000/api/itinerary')
            .then(res => res.json())
            .then(data => setItinerary(data));
    }, []);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredActivities = normalizedQuery
        ? activities.filter((activity) => {
            const haystack = [
                activity?.title,
                activity?.category,
                activity?.description,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedQuery);
        })
        : activities;

    const featuredActivity = filteredActivities[0];
    const gridActivities = filteredActivities.slice(1, 5);

    return (

        <div className="w-full px-6 py-6">
            <div className="mx-auto w-full max-w-6xl">

                {/* Top row: search + itinerary button */}
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full max-w-xl items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                        <SearchIcon fontSize="small" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                            className="w-full bg-transparent text-sm outline-none"
                        />
                    </div>

                    <button
                        type="button"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm"
                    >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
                            <FavoriteIcon sx={{ fontSize: 16 }} />
                        </span>
                        <span>Itinerary ({itinerary.length})</span>
                    </button>
                </div>

                {/* Featured + Itinerary */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Featured Section</h2>
                        </div>

                        {featuredActivity ? (
                            <ActivityCard key={featuredActivity.id} activity={featuredActivity} featured />
                        ) : (
                            <div className="rounded-xl bg-white p-6 text-sm text-gray-600">
                                No activities match your search.
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Itinerary</h2>
                        </div>
                        <ItineraryCard itinerary={itinerary} />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    <select
                        value={budgetFilter}
                        onChange={(e) => setBudgetFilter(e.target.value)}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm outline-none"
                    >
                        <option>Budget</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm outline-none"
                    >
                        <option>Category</option>
                    </select>
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm outline-none"
                    >
                        <option>Location</option>
                    </select>
                </div>

                {/* Grid of activities */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {gridActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} compact />
                    ))}
                </div>
            </div>
        </div>
    );
}
