export default function ItineraryCard({ itinerary }){
    return (
        <div className="rounded-xl bg-gray-200 p-4">
            <div className="space-y-4">
                {itinerary.map((item, index) => (
                    <div key={`${item.item}-${index}`} className="flex items-start gap-3">
                        {/* Timeline */}
                        <div className="relative flex w-6 justify-center">
                            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal-600" />
                            {index < itinerary.length - 1 && (
                                <span className="absolute top-5 h-[calc(100%-20px)] w-px bg-gray-300" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="inline-flex rounded-full bg-teal-600 px-3 py-1 text-xs text-white">
                                    {item.item}
                                </div>
                                <p className="mt-1 text-sm text-gray-800">{item.title}</p>
                            </div>

                            <button className="shrink-0 rounded-full bg-teal-600 px-3 py-1 text-xs text-white">
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}