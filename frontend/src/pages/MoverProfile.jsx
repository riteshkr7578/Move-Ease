import { useParams, Link } from "react-router-dom";
import { Star, MapPin, CheckCircle, Shield, Truck, Clock } from "lucide-react";
import SEO from "../components/SEO";

export default function MoverProfile() {
  const { id } = useParams();

  // Mock data for the profile - in a real app, you'd fetch this using the id
  const mover = {
    name: "QuickMove Packers",
    rating: 4.8,
    reviews: 124,
    experience: "8+ Years",
    location: "Mumbai, Maharashtra",
    basePrice: 5000,
    pricePerKm: 15,
    verified: true,
    description: "QuickMove Packers & Movers is a leading relocation service provider in Mumbai. We specialize in household shifting, office relocation, and vehicle transportation with a focus on safety and punctuality.",
    services: ["Home Shifting", "Office Shifting", "Vehicle Transport", "Fragile Item Handling", "Storage & Warehousing"],
    images: [
        "https://images.pexels.com/photos/5025664/pexels-photo-5025664.jpeg",
        "https://images.pexels.com/photos/4246011/pexels-photo-4246011.jpeg",
        "https://images.pexels.com/photos/4481258/pexels-photo-4481258.jpeg",
    ]
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 transition-colors duration-300">
      <SEO 
        title={`${mover.name} - Professional Movers in ${mover.location}`}
        description={mover.description}
        keywords={`packers and movers ${mover.location}, ${mover.name}, relocation services`}
        ogType="profile"
      />
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
          <div className="h-48 bg-blue-600 relative">
             <div className="absolute -bottom-16 left-8 p-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-4xl font-bold text-blue-600">
                    {mover.name.charAt(0)}
                </div>
             </div>
          </div>
          
          <div className="pt-20 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">{mover.name}</h1>
                {mover.verified && <CheckCircle className="text-blue-500 fill-blue-500/10" size={24} />}
              </div>
              <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  <span className="font-bold text-gray-900 dark:text-white">{mover.rating}</span>
                  <span>({mover.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span>{mover.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link to="/find-movers" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                Get Instant Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 dark:text-white">About the Mover</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {mover.description}
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Services Offered</h2>
              <div className="grid grid-cols-2 gap-4">
                {mover.services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <Truck size={20} />
                    </div>
                    <span className="font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Pricing Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Base Booking Fee</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{mover.basePrice}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                  <span>Price per Km</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{mover.pricePerKm}</span>
                </div>
                <hr className="dark:border-gray-700" />
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold mb-1">
                    <Shield size={16} />
                    <span>MoveEase Protected</span>
                  </div>
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                    Your booking is covered by our damage protection policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Why trust them?</h3>
                <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                        <Clock className="text-blue-500 mt-1" size={18} />
                        <div>
                            <p className="font-bold dark:text-white">{mover.experience} experience</p>
                            <p className="text-gray-500 dark:text-gray-400">Reliable service since 2016</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <CheckCircle className="text-green-500 mt-1" size={18} />
                        <div>
                            <p className="font-bold dark:text-white">Fully Verified</p>
                            <p className="text-gray-500 dark:text-gray-400">Document & License verified</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
