import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
    const { removeBg } = useContext(AppContext);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:gap-16">
            {/* Left Side: Video Banner */}
            <div className="order-1 md:order-1 flex justify-center">
                <div className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden">
                    <video
                        src={assets.videoBanner}
                        autoPlay
                        loop
                        muted
                        className="w-full max-w-[400px] h-auto object-cover"
                    ></video>
                </div>
            </div>
            {/* Right Side: Text Content */}
            <div className="order-2 md:order-2">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    The fastest <span className="text-indigo-700">background eraser.</span>
                </h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Transform your photos in seconds with our AI-powered background removal tool!
                    Highlight your subject and let our advanced technology do the rest. So you can
                    focus on what matters most - your creativity. Try it now and see the magic happen!
                </p>
                <div>
                    <input type="file" accept="image/*" id="upload1" hidden onChange={(e) => removeBg(e.target.files[0])} />
                    <label htmlFor="upload1" className="bg-black text-white font-medium px-8 py-4 rounded-full hover:opacity-80 transition-transform hover:scale-105 text-lg">
                        Upload your image
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Header;