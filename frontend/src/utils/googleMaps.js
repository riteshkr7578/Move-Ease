let mapsPromise = null;

export function loadGoogleMaps() {
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    window.__moveEaseGoogleMapsCallback = () => resolve(window.google.maps);

    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js" +
      `?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}` +
      "&libraries=places" +
      "&callback=__moveEaseGoogleMapsCallback" +
      "&loading=async";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      mapsPromise = null;
      reject(new Error("Failed to load Google Maps JavaScript API"));
    };
    document.head.appendChild(script);
  });

  return mapsPromise;
}