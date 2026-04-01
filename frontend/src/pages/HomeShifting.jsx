export default function HomeShifting() {
  return (
    <>
 

      <section className="bg-white dark:bg-gray-900 py-16 px-4 sm:px-8 lg:px-16 min-h-screen transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Home Shifting Services
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Seamless and stress-free relocation. From packing to delivery — we handle it all with care.
          </p>
        </div>

        {/* Service Highlights */}
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Secure Packing
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fragile or heavy — our professional team packs everything with premium materials.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="text-5xl mb-4">🚚</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Hassle-Free Moving
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Local or long-distance — we ensure safe and timely transportation.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="text-5xl mb-4">🔧</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Furniture Handling
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Dismantling, reassembling, and placing items where they belong — we do it all.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/find-movers"
            className="inline-block bg-blue-600 text-white text-lg font-medium px-8 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Get a Free Home Shifting Quote
          </a>
        </div>
      </section>
    </>
  );
}
