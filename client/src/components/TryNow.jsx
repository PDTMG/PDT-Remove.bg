"use client"

import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import { Upload, ArrowRight, Sparkles, Heart, Star, Sun } from "lucide-react"

const TryNow = () => {
    const { removeBg } = useContext(AppContext)

    return (
        <div className="py-20 relative">
            <div className="relative overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-3xl p-12 md:p-16 shadow-2xl border-2 border-green-200">
                {/* Floating magical elements */}
                <div className="absolute top-8 left-8 animate-bounce" style={{ animationDelay: "0s", animationDuration: "4s" }}>
                    <Sparkles className="w-8 h-8 text-yellow-400 opacity-60" />
                </div>
                <div
                    className="absolute top-16 right-16 animate-bounce"
                    style={{ animationDelay: "2s", animationDuration: "6s" }}
                >
                    <Heart className="w-6 h-6 text-pink-400 opacity-50" />
                </div>
                <div
                    className="absolute bottom-12 right-8 animate-bounce"
                    style={{ animationDelay: "4s", animationDuration: "5s" }}
                >
                    <Star className="w-10 h-10 text-blue-400 opacity-40" />
                </div>
                <div
                    className="absolute bottom-16 left-12 animate-bounce"
                    style={{ animationDelay: "1s", animationDuration: "7s" }}
                >
                    <Sun className="w-7 h-7 text-orange-400 opacity-45" />
                </div>

                <div className="relative text-center">
                    {/* Magical Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-green-200 mb-8">
                        <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
                        <span className="text-sm font-semibold text-green-700">✨ Ready for Magic?</span>
                    </div>

                    {/* Magical Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Let's Create Some
                        <br />
                        <span className="relative">
                            <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Beautiful Magic
                            </span>
                            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-200/50 rounded-full -z-10"></div>
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Upload your photo and watch as our gentle AI magic removes the background with the care of a master artist.
                        <span className="text-green-600 font-semibold"> No account needed</span> to start your magical journey! ✨
                    </p>

                    {/* Magical Upload Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto mb-8 shadow-xl border-2 border-green-200 relative overflow-hidden">
                        {/* Decorative corners */}
                        <div className="absolute top-4 left-4 w-6 h-6 border-l-3 border-t-3 border-green-400 rounded-tl-lg"></div>
                        <div className="absolute top-4 right-4 w-6 h-6 border-r-3 border-t-3 border-blue-400 rounded-tr-lg"></div>
                        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-3 border-b-3 border-purple-400 rounded-bl-lg"></div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-3 border-b-3 border-pink-400 rounded-br-lg"></div>

                        <input type="file" id="upload2" hidden accept="image/*" onChange={(e) => removeBg(e.target.files[0])} />

                        <label htmlFor="upload2" className="group flex flex-col items-center gap-4 cursor-pointer relative">
                            {/* Magical upload icon */}
                            <div className="relative w-24 h-24 bg-gradient-to-r from-green-200 to-blue-200 rounded-full flex items-center justify-center group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-300 group-hover:scale-110 shadow-lg border-2 border-green-300">
                                {/* Floating sparkles around icon */}
                                <div className="absolute -top-2 -right-2 animate-ping">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                </div>
                                <div className="absolute -bottom-2 -left-2 animate-ping" style={{ animationDelay: "0.5s" }}>
                                    <Heart className="w-3 h-3 text-pink-400" />
                                </div>

                                <Upload className="w-12 h-12 text-green-600 relative z-10 group-hover:text-green-700 transition-colors duration-300 group-hover:animate-bounce" />
                            </div>

                            <div className="text-center relative z-10">
                                <div className="text-gray-800 font-bold text-lg mb-2 group-hover:text-green-700 transition-colors duration-300">
                                    ✨ Choose Your Photo
                                </div>
                                <div className="text-gray-600 text-sm">
                                    or drop a file, paste image or <span className="text-blue-600 underline">browse from web</span>
                                </div>
                            </div>
                        </label>

                        {/* Magical glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 via-blue-200/20 to-purple-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                    </div>

                    {/* Magical Features */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
                        <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-lg border border-green-200">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-700 font-semibold">Free to try</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-lg border border-blue-200">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                            <span className="text-blue-700 font-semibold">No signup needed</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-lg border border-purple-200">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                            <span className="text-purple-700 font-semibold">Instant magic</span>
                        </div>
                    </div>

                    {/* Magical CTA */}
                    <div className="mt-12">
                        <div className="inline-flex items-center gap-3 text-gray-600 bg-white/60 px-6 py-3 rounded-full shadow-lg border-2 border-green-100">
                            <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                            <span>Start your magical journey now</span>
                            <ArrowRight className="w-4 h-4 animate-bounce text-green-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TryNow
