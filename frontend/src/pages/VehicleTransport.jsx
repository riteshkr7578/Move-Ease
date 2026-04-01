export default function VehicleTransport() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900 py-16 px-4 sm:px-8 lg:px-16 min-h-screen transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Vehicle Transport Services
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Two-wheelers or cars — we transport your vehicle with zero stress and complete protection.
          </p>
        </div>

        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="text-5xl mb-4">🏍️</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Bike Transport
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Special protective packaging ensures scratch-free transit of your motorcycles.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="text-5xl mb-4">🚗</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Car Carrier Service
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Car loading ramps & secured carriers ensure safe delivery across all cities.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Transit Insurance
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Full-coverage insurance options for guaranteed peace of mind.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/find-movers"
            className="inline-block bg-blue-600 dark:bg-blue-500 text-white text-lg font-medium px-8 py-3 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            Get Vehicle Transport Quote
          </a>
        </div>
      </section>
    </>
  );
}
