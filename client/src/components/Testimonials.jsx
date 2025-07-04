import { testimonials } from "../assets/assets"
import { Quote, Star, Heart, Sparkles, Sun, Smile } from "lucide-react"

const Testimonials = () => {
    return (
        <div className="py-20 relative">
            {/* Floating magical elements */}
            <div className="absolute top-12 left-12 animate-bounce" style={{ animationDelay: "0s", animationDuration: "4s" }}>
                <Heart className="w-8 h-8 text-pink-300 opacity-40" />
            </div>
            <div
                className="absolute top-20 right-16 animate-bounce"
                style={{ animationDelay: "2s", animationDuration: "6s" }}
            >
                <Sparkles className="w-6 h-6 text-yellow-300 opacity-50" />
            </div>
            <div
                className="absolute bottom-16 left-20 animate-bounce"
                style={{ animationDelay: "4s", animationDuration: "5s" }}
            >
                <Sun className="w-7 h-7 text-orange-300 opacity-35" />
            </div>

            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full shadow-lg border-2 border-pink-200 mb-6">
                    <Heart className="w-4 h-4 text-pink-600 animate-pulse" />
                    <span className="text-sm font-semibold text-pink-700">💕 Happy Stories</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    <span className="relative">
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            They Love Us
                        </span>
                        <div className="absolute -bottom-2 left-0 right-0 h-3 bg-pink-200/50 rounded-full -z-10"></div>
                    </span>
                    <br />
                    <span className="text-gray-700">And You Will Too!</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Join our magical community of happy users who've discovered the joy of effortless background removal
                </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id}
                        className="group relative bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-green-100 hover:border-green-200 overflow-hidden"
                        style={{
                            animationDelay: `${index * 100}ms`,
                        }}
                    >
                        {/* Magical sparkles overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute top-4 right-4 animate-ping">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div className="absolute bottom-6 left-6 animate-ping" style={{ animationDelay: "0.5s" }}>
                                <Heart className="w-3 h-3 text-pink-400" />
                            </div>
                        </div>

                        {/* Quote bubble */}
                        <div className="absolute -top-4 left-8">
                            <div className="bg-gradient-to-r from-green-400 to-blue-400 p-3 rounded-2xl shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                <Quote className="w-6 h-6 text-white relative z-10" />
                            </div>
                        </div>

                        {/* Magical rating */}
                        <div className="flex gap-1 mb-6 mt-4">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-5 h-5 text-yellow-400 fill-current animate-bounce"
                                    style={{ animationDelay: `${i * 100}ms`, animationDuration: "2s" }}
                                />
                            ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic relative z-10 group-hover:text-gray-800 transition-colors duration-300">
                            "{testimonial.quote}"
                        </blockquote>

                        {/* Author with magical avatar */}
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                <span className="relative z-10">{testimonial.author.charAt(0)}</span>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300 flex items-center gap-2">
                                    {testimonial.author}
                                    <Smile className="w-4 h-4 text-yellow-500" />
                                </div>
                                <div className="text-gray-500 text-sm">{testimonial.handle}</div>
                            </div>
                        </div>

                        {/* Magical border glow */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-200/20 via-blue-200/20 to-purple-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default Testimonials
