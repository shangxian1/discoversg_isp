export default function ItineraryCard({ itinerary }){
    return (
        <div className="bg-gray-200 p-4 rounded-x1">
            {itinerary.map(item => (
                <div key={item.item} className="flex items-start gap-3 mb-4">
                    <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
                        {item.item}
                    </div>
                    <p>{item.title}</p>
                </div>
            ))}
            <button className="bg-teal-600 text-white px-3 py-1 rounded-full">
                View
            </button>
        </div>
    );
}