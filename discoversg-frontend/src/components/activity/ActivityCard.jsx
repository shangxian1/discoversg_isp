export default function ActivityCard({ activity, featured  }){
    return(
        <div className={`bg-white rounded-x1 shadow ${featured ? 'flex' : ''}`}>
            <img src={activity.image} className="rounded-t-x1" />
            <div className = "p-4">
                <h3 className="font-bold">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.category}</p>
                <button className="mt-3-teal-600 text-white px-4 py-1 rounded-full">
                    +Add
                </button>
            </div>
        </div>
    );
}