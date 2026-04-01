import { useState } from "react";
import Select from "react-select";

export default function SearchMovers({ onSearch }) {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [moveType, setMoveType] = useState("");
  const [services, setServices] = useState([]);

  const cityOptions = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Chennai", label: "Chennai" },
    { value: "Kolkata", label: "Kolkata" },
  ];

  const toggleService = (service) => {
    if (services.includes(service)) {
      setServices(services.filter((s) => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const handleSubmit = () => {
    if (!fromCity) {
      alert("Please select a city before comparing movers");
      return;
    }
    
    onSearch({
      fromCity,
     
      moveType,
      services,
    });
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 shadow-xl rounded-2xl p-8 bg-white dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">
          Compare &amp; Book Verified Packers and Movers
        </h2>

        {/* FROM / TO with city suggestions */}
        <div className="grid mb-6">
          <div className="w-full">
            <Select
              options={cityOptions}
              value={cityOptions.find((c) => c.value === fromCity) || null}
              onChange={(selectedOption) => setFromCity(selectedOption ? selectedOption.value : "")}
              placeholder="🔍 Select City..."
              isClearable
              isSearchable
              unstyled
              classNames={{
                control: ({ isFocused }) => 
                  `p-3 rounded-lg border transition-colors ${
                    isFocused 
                      ? 'border-blue-500 ring-1 ring-blue-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`,
                menu: () => "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-xl z-50 overflow-hidden",
                option: ({ isFocused, isSelected }) => 
                  `px-4 py-3 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : isFocused 
                        ? 'bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`,
                singleValue: () => "text-gray-900 dark:text-white text-lg",
                input: () => "text-gray-900 dark:text-white text-lg",
                placeholder: () => "text-gray-500 dark:text-gray-400 text-lg",
                menuList: () => "p-1",
                dropdownIndicator: () => "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2",
                clearIndicator: () => "text-gray-400 hover:text-red-500 px-2",
                valueContainer: () => "gap-1 px-2"
              }}
            />
          </div>

          {/* <div>
            <input
              type="text"
              list="city-list"
              placeholder="To City"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="p-4 border rounded-lg w-full"
            />
          </div> */}
        </div>

        {/* Move Type */}
        <div className="mb-6">
          <label className="font-semibold dark:text-gray-200">Move Type</label>
          <select
            className="w-full p-4 mt-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={moveType}
            onChange={(e) => setMoveType(e.target.value)}
          >
            <option value="">Select Move Type</option>
            <option>Home Shifting</option>
            <option>Office Shifting</option>
            <option>Vehicle Transport</option>
            <option>Storage &amp; Warehouse</option>
          </select>
        </div>

        {/* Additional Services */}
        <div>
          <label className="font-semibold dark:text-gray-200">Additional Services</label>
          <div className="flex gap-6 mt-2 flex-wrap dark:text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={services.includes("Packing")}
                onChange={() => toggleService("Packing")}
              />
              Packing
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={services.includes("Storage")}
                onChange={() => toggleService("Storage")}
              />
              Storage
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={services.includes("Insurance")}
                onChange={() => toggleService("Insurance")}
              />
              Insurance
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg"
          >
            Compare Movers
          </button>
        </div>
      </div>
    </section>
  );
}
