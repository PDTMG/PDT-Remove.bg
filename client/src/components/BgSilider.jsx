"use client"

import { useState, useCallback } from "react"
import { categoryImages, categories } from "../assets/assets"
import { Eye, Sparkles, Heart, Sun } from "lucide-react"

const BgSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [activeCategory, setActiveCategory] = useState("People")

  const handleSliderChange = useCallback((e) => {
    setSliderPosition(e.target.value)
  }, [])

  return (
    <div className="py-16 relative">
      {/* Reduced floating elements */}
      <div className="absolute top-8 left-8 opacity-30">
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </div>
      <div className="absolute top-16 right-12 opacity-25">
        <Heart className="w-4 h-4 text-pink-400" />
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full shadow-lg border-2 border-blue-200 mb-6">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">✨ See the Magic Happen</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 px-4">
          <span className="relative">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Beautiful Results
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200/50 rounded-full -z-10"></div>
          </span>
          <br />
          <span className="text-gray-700">Every Single Time</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Watch as our gentle AI magic transforms your images with the care of a master artist
        </p>
      </div>

      {/* Category Selector */}
      <div className="flex justify-center mb-10 px-4">
        <div className="inline-flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg border-2 border-green-200 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeCategory === category
                  ? "bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-green-50"
                }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Image Comparison - Optimized */}
      <div className="relative w-full max-w-4xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 aspect-[4/3] shadow-xl border-2 border-green-200">
          {/* Corner decorations - simplified */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-green-400 rounded-tl-lg"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-blue-400 rounded-tr-lg"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-purple-400 rounded-bl-lg"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-pink-400 rounded-br-lg"></div>

          {/* Background Removed Image */}
          <img
            src={categoryImages[activeCategory]?.removed || "/placeholder.svg"}
            alt="Magically processed image"
            className="w-full h-full object-cover"
          />

          {/* Original Image Overlay - Optimized */}
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              willChange: "clip-path",
            }}
          >
            <img
              src={categoryImages[activeCategory]?.original || "/placeholder.svg"}
              alt="Original image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Labels - Simplified */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-red-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-xs font-semibold text-red-600">Before Magic</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-green-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs font-semibold text-green-600">After Magic ✨</span>
            </div>
          </div>

          {/* Optimized Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 shadow-lg z-20 pointer-events-none"
            style={{
              left: `${sliderPosition}%`,
              transform: "translateX(-50%)",
              willChange: "left",
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-green-200">
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <Sun className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Optimized Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-col-resize z-30"
            style={{ willChange: "auto" }}
          />

          {/* Reduced floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Sparkles className="absolute top-1/4 right-1/4 w-4 h-4 text-yellow-400 opacity-40" />
            <Heart className="absolute bottom-1/3 left-1/3 w-3 h-3 text-pink-400 opacity-30" />
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-3 text-gray-600 bg-white/70 px-4 py-2 rounded-full shadow-md border border-green-100">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Drag the magical slider to see the transformation</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BgSlider
