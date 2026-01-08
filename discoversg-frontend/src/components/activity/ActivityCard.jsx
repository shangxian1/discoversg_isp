import { Link } from 'react-router-dom';

export default function ActivityCard({ activity, featured, compact }) {
    // Destructure the fields sent from your backend
    const title = activity?.title ?? '';
    const category = activity?.category ?? '';
    const location = activity?.location ?? '';       // e.g., "City Hall"
    const description = activity?.description ?? ''; // e.g., "Southeast Asian art museum..."
    const price = activity?.price ?? '';
    const image = activity?.image ?? '';

    // Compact Layout (used in the bottom grid)
    if (compact) {
        return (
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow">
                <img src={image} alt={title} className="h-36 w-full object-cover" />
                <div className="flex flex-grow flex-col bg-gray-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold">{title}</h3>
                            <p className="text-[10px] font-medium text-gray-500 uppercase">{location}</p>
                        </div>
                        <Link to={`/activity/${activity.id}`} className="shrink-0 rounded-full bg-teal-600 px-3 py-1 text-xs text-white">
                            View
                        </Link>
                    </div>
                    {/* Shows a short snippet of the database description */}
                    <p className="mt-2 line-clamp-2 text-xs text-gray-600 italic">
                        "{description}"
                    </p>
                    <p className="mt-auto pt-2 text-sm font-bold text-teal-600">
                        {parseFloat(price) > 0 ? `$${price}` : 'Free'}
                    </p>
                </div>
            </div>
        );
    }

    // Featured Layout (used for the large top activity)
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow">
            <img src={image} alt={title} className="h-64 w-full object-cover" />
            <div className="bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 uppercase">
                        {category}
                    </span>
                </div>
                <p className="text-sm font-semibold text-gray-500">{location}</p>
                
                {/* Renders the full description blurb from the activity table */}
                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                    {description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-teal-600">
                        {parseFloat(price) > 0 ? `$${price}` : 'Free'}
                    </p>
                    <Link to={`/activity/${activity.id}`} className="rounded-full bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
                        Learn More
                    </Link>
                </div>
            </div>
        </div>
    );
}