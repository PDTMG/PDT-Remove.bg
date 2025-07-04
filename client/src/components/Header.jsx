"use client"

import { useContext } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"
import { Upload, Sparkles, Heart, Leaf, Sun } from "lucide-react"

const Header = () => {
    const { removeBg } = useContext(AppContext)

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 rounded-3xl p-8 md:p-12 mb-20 border-2 border-green-200/50 shadow-xl">
            {/* Floating clouds */}
            <div
                className="absolute top-4 right-8 w-20 h-12 bg-white/60 rounded-full blur-sm animate-bounce"
                style={{ animationDelay: "0s", animationDuration: "6s" }}
            ></div>
            <div
                className="absolute top-12 right-24 w-16 h-8 bg-white/40 rounded-full blur-sm animate-bounce"
                style={{ animationDelay: "2s", animationDuration: "8s" }}
            ></div>
            <div
                className="absolute top-6 right-40 w-12 h-6 bg-white/50 rounded-full blur-sm animate-bounce"
                style={{ animationDelay: "4s", animationDuration: "7s" }}
            ></div>

            {/* Floating leaves */}
            <div className="absolute top-16 left-12 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }}>
                <Leaf className="w-6 h-6 text-green-400 opacity-60 transform rotate-12" />
            </div>
            <div className="absolute top-32 left-32 animate-bounce" style={{ animationDelay: "3s", animationDuration: "5s" }}>
                <Leaf className="w-4 h-4 text-green-500 opacity-40 transform -rotate-45" />
            </div>
            <div
                className="absolute bottom-20 right-16 animate-bounce"
                style={{ animationDelay: "2s", animationDuration: "6s" }}
            >
                <Sparkles className="w-5 h-5 text-yellow-400 opacity-70" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side: Content */}
                <div className="order-2 lg:order-1 space-y-8">
                    {/* Ghibli-style Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-green-200">
                        <Sun className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="text-sm font-semibold text-green-700">✨ Magical AI Background Removal</span>
                    </div>

                    {/* Whimsical Heading */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                            The most{" "}
                            <span className="relative">
                                <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    magical
                                </span>
                                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-200/50 rounded-full -z-10"></div>
                            </span>
                            <br />
                            background remover
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                            Step into a world where technology meets magic! Our enchanted AI will gently remove backgrounds from your
                            photos, leaving only the beauty you want to keep. ✨
                        </p>
                    </div>

                    {/* Magical Features */}
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-gray-700 group">
                            <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Sparkles className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-medium">Instant Magic</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 group">
                            <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Heart className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium">Made with Love</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 group">
                            <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Sun className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium">Crystal Clear</span>
                        </div>
                    </div>

                    {/* Magical CTA Button */}
                    <div className="space-y-4">
                        <input type="file" accept="image/*" id="upload1" hidden onChange={(e) => removeBg(e.target.files[0])} />
                        <label
                            htmlFor="upload1"
                            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 hover:from-green-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
                        >
                            {/* Magical sparkle effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-pink-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Upload className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
                            <span className="relative z-10">✨ Choose Your Photo</span>

                            {/* Floating sparkles */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                            <div
                                className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping"
                                style={{ animationDelay: "0.5s" }}
                            ></div>
                        </label>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-400" />
                            PNG, JPG welcome • Up to 10MB • Free to try • Made with magic
                        </p>
                    </div>
                </div>

                {/* Right Side: Magical Video Container */}
                <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative">
                        {/* Magical glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-300/30 via-blue-300/30 to-purple-300/30 rounded-3xl blur-2xl scale-110 animate-pulse"></div>

                        {/* Main container with nature theme */}
                        <div className="relative bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-2 border-green-200">
                            {/* Decorative corners */}
                            <div className="absolute top-3 left-3 w-6 h-6 border-l-3 border-t-3 border-green-400 rounded-tl-lg"></div>
                            <div className="absolute top-3 right-3 w-6 h-6 border-r-3 border-t-3 border-blue-400 rounded-tr-lg"></div>
                            <div className="absolute bottom-3 left-3 w-6 h-6 border-l-3 border-b-3 border-purple-400 rounded-bl-lg"></div>
                            <div className="absolute bottom-3 right-3 w-6 h-6 border-r-3 border-b-3 border-pink-400 rounded-br-lg"></div>

                            <video
                                src={assets.videoBanner}
                                autoPlay
                                loop
                                muted
                                className="w-full max-w-[400px] h-auto object-cover rounded-2xl shadow-lg"
                            />

                            {/* Magical status */}
                            <div className="absolute top-8 right-8 flex flex-col gap-2">
                                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-green-200">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-700 font-semibold">✨ Magic Active</span>
                                </div>
                            </div>

                            {/* Floating elements around video */}
                            <div
                                className="absolute -top-4 -left-4 animate-bounce"
                                style={{ animationDelay: "1s", animationDuration: "3s" }}
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full shadow-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div
                                className="absolute -bottom-4 -right-4 animate-bounce"
                                style={{ animationDelay: "2s", animationDuration: "4s" }}
                            >
                                <div className="w-6 h-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full shadow-lg flex items-center justify-center">
                                    <Heart className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
