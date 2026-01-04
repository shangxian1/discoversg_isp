export default function ActivityCard({ activity, featured, compact }) {
    const title = activity?.title ?? '';
    const category = activity?.category ?? '';
    const description = activity?.description ?? '';
    const price = activity?.price ?? '';

    if (compact) {
        return (
            <div className="overflow-hidden rounded-xl bg-white shadow">
                <div>
                    <img
                        src={activity.image}
                        alt={title}
                        className="h-36 w-full object-cover"
                    />
                </div>

                <div className="bg-gray-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold">{title}</h3>
                            <p className="text-xs text-gray-500">{category}</p>
                        </div>
                        <button className="shrink-0 rounded-full bg-teal-600 px-3 py-1 text-xs text-white">
                            View
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-600">{description}</p>
                    <p className="mt-2 text-sm font-semibold text-teal-600">${price}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl bg-white shadow">

            {/* Image section */}
            <div>
                <img
                    src={activity.image}
                    alt={title}
                    className={featured ? 'h-56 w-full object-cover' : 'h-48 w-full object-cover'}
                />
            </div>

            {/* Content section */}
            <div className="flex flex-col justify-between bg-gray-50 p-4">
                <div>
                    <h3 className={featured ? 'text-lg font-bold' : 'text-base font-bold'}>
                        {title}
                    </h3>

                    <p className="text-sm text-gray-500">{category}</p>

                    <p className="mt-3 text-sm text-gray-700">{description}</p>

                    <p className="mt-2 font-semibold text-teal-600">${price}</p>
                </div>

                <div className="mt-4 flex justify-end">
                    <button className="rounded-full bg-teal-600 px-4 py-1 text-sm text-white">
                        View
                    </button>
                </div>
            </div>

        </div>
    );
}
