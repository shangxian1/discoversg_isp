import React, { useEffect, useState } from 'react';
import ActivityCard from '../components/activity/ActivityCard';
import ItineraryCard from '../components/activity/ItineraryCard';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const [itinerary, setItinerary] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/activities')
            .then(res => res.json())
            .then(data => setActivities(data));

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
                activity?.location,
                activity?.summary,
            ].filter(Boolean).join(' ').toLowerCase();

            return haystack.includes(normalizedQuery);
        })
        : activities;

    // CHANGE: Select the first activity for the featured slot
    const featuredActivity = filteredActivities[0];
    
    // FIX: Remove .slice(1, 5) to show ALL remaining activities
    const gridActivities = filteredActivities.slice(1); 

    return (
        <div className="w-full px-6 py-6">
            <div className="mx-auto w-full max-w-6xl">
                {/* Search and Header UI remains the same */}
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
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-semibold mb-3">Featured Section</h2>
                        {featuredActivity && <ActivityCard activity={featuredActivity} featured />}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Itinerary</h2>
                        <ItineraryCard itinerary={itinerary} />
                    </div>
                </div>

                {/* Grid now displays all items from the database */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {gridActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} compact />
                    ))}
                </div>
            </div>
        </div>
    );
}