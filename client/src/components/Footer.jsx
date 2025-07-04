import { assets, FOOTER_CONSTANTS } from "../assets/assets"
import { Heart, ExternalLink, Sparkles, Sun, Star } from "lucide-react"

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-t-2 border-green-100 relative overflow-hidden">
            {/* Floating magical elements */}
            <div className="absolute top-8 left-8 animate-bounce" style={{ animationDelay: "0s", animationDuration: "6s" }}>
                <Sparkles className="w-6 h-6 text-yellow-300 opacity-40" />
            </div>
            <div
                className="absolute top-12 right-12 animate-bounce"
                style={{ animationDelay: "2s", animationDuration: "8s" }}
            >
                <Heart className="w-5 h-5 text-pink-300 opacity-50" />
            </div>
            <div
                className="absolute bottom-8 left-16 animate-bounce"
                style={{ animationDelay: "4s", animationDuration: "7s" }}
            >
                <Star className="w-4 h-4 text-blue-300 opacity-45" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Magical Logo & Brand */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 rounded-xl blur-lg opacity-50"></div>
                            <img
                                src={assets.logo || "/placeholder.svg"}
                                alt="logo"
                                className="relative w-12 h-12 object-contain rounded-xl border-2 border-green-200 shadow-lg"
                            />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                                    Remove.bg
                                </span>
                                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                            </div>
                            <div className="text-sm text-gray-600">✨ Made with magic & love</div>
                        </div>
                    </div>

                    {/* Magical Copyright */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                            <Sun className="w-4 h-4 text-orange-400 animate-pulse" />
                            <span>&copy; {new Date().getFullYear()}</span>
                            <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                            <span>@engineertalkpaduti</span>
                        </div>
                        <p className="text-sm text-gray-500">All magical rights reserved</p>
                    </div>

                    {/* Magical Social Links */}
                    <div className="flex justify-center md:justify-end">
                        <div className="flex gap-4">
                            {FOOTER_CONSTANTS.map((item, index) => (
                                <a
                                    href={item.url}
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative p-3 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-green-100 hover:border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 overflow-hidden"
                                >
                                    {/* Magical hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 via-blue-200/20 to-purple-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <img
                                        src={item.logo || "/placeholder.svg"}
                                        alt="social logo"
                                        className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity relative z-10"
                                    />
                                    <ExternalLink className="absolute -top-1 -right-1 w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Magical sparkle */}
                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity"></div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Magical Footer Links */}
                <div className="mt-8 pt-8 border-t-2 border-green-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                            <a href="#" className="hover:text-green-600 transition-colors duration-200 flex items-center gap-1">
                                <Heart className="w-3 h-3 text-pink-400" />
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-green-600 transition-colors duration-200 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-green-600 transition-colors duration-200 flex items-center gap-1">
                                <Sun className="w-3 h-3 text-orange-400" />
                                Support
                            </a>
                            <a href="#" className="hover:text-green-600 transition-colors duration-200 flex items-center gap-1">
                                <Star className="w-3 h-3 text-blue-400" />
                                API
                            </a>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>Crafted with</span>
                            <Heart className="inline w-4 h-4 text-red-400 fill-current animate-pulse" />
                            <span className="text-green-600 font-semibold">magical technology</span>
                            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
