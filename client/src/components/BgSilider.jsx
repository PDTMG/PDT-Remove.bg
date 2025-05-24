import { useState } from "react";
import { assets, categories } from "../assets/assets";

const BgSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeCategory, setActiveCategory] = useState("People");

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="mb-16 relative">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
        Amazing Quality Results
      </h2>
      
      {/* Category Selector */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex gap-2 bg-gray-100 p-1 rounded-full flex-wrap justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Image Comparison Slider */}
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-xl shadow-2xl bg-gray-100 aspect-[4/3]">
          {/* Background Removed Image (base layer - bên phải) */}
          <img
            src={assets.people || "/placeholder.svg"}
            alt="Background removed image"
            className="w-full h-full object-cover block"
          />
          
          {/* Original Image (overlay - bên trái) */}
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={assets.peopleorg || "/placeholder.svg"}
              alt="Original image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8L22 12L18 16"/>
                <path d="M6 8L2 12L6 16"/>
              </svg>
            </div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-col-resize z-30"
          />
        </div>

      </div>
    </div>
  );
};

export default BgSlider;