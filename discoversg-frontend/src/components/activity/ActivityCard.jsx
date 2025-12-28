export default function ActivityCard({ activity, featured }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden w-100">

            {/* Image section */}
            <div className="w-100">
                <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-100 h-48 object-cover"
                />
            </div>

            {/* Content section */}
            <div className="p-4 flex flex-col justify-between bg-gray-50">
                <div>
                    <h3 className="font-bold text-lg">
                        {activity.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {activity.category}
                    </p>

                    <p className="mt-4">
                        {activity.description}
                    </p>

                    <p className="mt-2 font-semibold text-teal-600">
                        ${activity.price}
                    </p>
                </div>

                <div className="mt-4">
                    <button className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm">
                        View
                    </button>
                </div>
            </div>

        </div>
    );
}
