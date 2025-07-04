import { steps } from "../assets/assets"
import { ArrowRight, Upload, Wand2, Download, Sparkles, Heart } from "lucide-react"

const BgRemovalStep = () => {
    const getStepIcon = (step) => {
        switch (step) {
            case 1:
                return <Upload className="w-6 h-6" />
            case 2:
                return <Wand2 className="w-6 h-6" />
            case 3:
                return <Download className="w-6 h-6" />
            default:
                return <Upload className="w-6 h-6" />
        }
    }

    const getStepGradient = (step) => {
        switch (step) {
            case 1:
                return "from-green-400 to-emerald-500"
            case 2:
                return "from-blue-400 to-purple-500"
            case 3:
                return "from-pink-400 to-rose-500"
            default:
                return "from-gray-400 to-gray-500"
        }
    }

    const getStepBg = (step) => {
        switch (step) {
            case 1:
                return "from-green-50 to-emerald-50"
            case 2:
                return "from-blue-50 to-purple-50"
            case 3:
                return "from-pink-50 to-rose-50"
            default:
                return "from-gray-50 to-gray-100"
        }
    }

    return (
        <div className="py-16 relative">
            {/* Reduced floating elements */}
            <div className="absolute top-10 left-10 opacity-30">
                <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="absolute top-20 right-20 opacity-25">
                <Heart className="w-5 h-5 text-pink-400" />
            </div>

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full shadow-lg border-2 border-green-200 mb-6">
                    <Wand2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">✨ How the Magic Works</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 px-4">
                    Remove Backgrounds with{" "}
                    <span className="relative">
                        <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            3 Simple Steps
                        </span>
                        <div className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-200/50 rounded-full -z-10"></div>
                    </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                    Like a gentle breeze through a meadow, our magical process makes background removal effortless
                </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4 max-w-7xl mx-auto relative">
                {/* Connection line */}
                <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-green-200 via-blue-200 to-pink-200 rounded-full opacity-60"></div>

                {steps.map((item, index) => (
                    <div key={index} className="relative group">
                        {/* Card with fixed height */}
                        <div
                            className={`bg-gradient-to-br ${getStepBg(item.step)} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-white/50 hover:border-green-200 relative overflow-hidden min-h-[320px] flex flex-col`}
                        >
                            {/* Reduced sparkles */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute top-4 right-4">
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                </div>
                            </div>

                            {/* Header section */}
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`p-3 rounded-xl bg-gradient-to-r ${getStepGradient(item.step)} shadow-md text-white transition-transform duration-300 group-hover:scale-105`}
                                >
                                    {getStepIcon(item.step)}
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-gray-300 group-hover:text-gray-400 transition-colors duration-300">
                                        0{item.step}
                                    </span>
                                </div>
                            </div>

                            {/* Content section - flex grow to fill space */}
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300 leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        {/* Connection dot */}
                        <div className="hidden md:block absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div
                                className={`w-4 h-4 rounded-full bg-gradient-to-r ${getStepGradient(item.step)} shadow-md border-2 border-white`}
                            ></div>
                        </div>

                        {/* Mobile arrow */}
                        {index < steps.length - 1 && (
                            <div className="md:hidden flex justify-center mt-6">
                                <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full shadow-md border-2 border-green-200">
                                    <ArrowRight className="w-4 h-4 text-green-600 rotate-90" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom message */}
            <div className="text-center mt-12">
                <div className="inline-flex items-center gap-3 text-gray-600 bg-white/60 px-6 py-3 rounded-full shadow-lg border-2 border-green-100">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>Ready to create some magic?</span>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
            </div>
        </div>
    )
}

export default BgRemovalStep
