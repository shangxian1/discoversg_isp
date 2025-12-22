import React, { useEffect, useState } from 'react';
import ActivityCard from '../components/activity/ActivityCard';
import ItineraryCard from '../components/activity/ItineraryCard';

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const [itinerary, setItinerary] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/activities')
            .then(res => res.json())
            .then(data => setActivities(data));

        fetch('http://localhost:3000/api/itinerary')
            .then(res => res.json())
            .then(data => setItinerary(data));
    }, []);

    return (

        <div className="grid grid-cols-3 gap-6 px-6">
            <div className="col-span-2">
            {activities.slice(0, 1).map(act => (
                <ActivityCard key={act.id} activity={act} featured />
            ))}
            </div>

            <div>
            <ItineraryCard itinerary={itinerary} />
            </div>
        </div>
    );
}
