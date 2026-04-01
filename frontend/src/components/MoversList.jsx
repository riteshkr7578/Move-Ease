import { Link } from "react-router-dom";

export default function MoversList({ movers }) {
  if (!movers || movers.length === 0) return null;

  return (
    <section className="py-16 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">
        Available Movers
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {movers.map((mover) => (
          <div
            key={mover._id}
            className="p-6 shadow-md rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-xl font-bold dark:text-white">{mover.name}</h3>

            <p className="text-gray-600 dark:text-gray-300 mt-2">
              ₹{mover.pricePerKm}/km • Base: ₹{mover.basePrice}
            </p>

            {mover.city && (
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                City: {mover.city}
              </p>
            )}

            <Link
              to={`/booking?moverId=${mover._id}`}
              className="block text-center mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            >
              Book This Mover
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
