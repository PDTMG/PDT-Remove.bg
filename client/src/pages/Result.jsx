import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Result = () => {
    const { image, resultImage } = useContext(AppContext);
    const navigate = useNavigate();

    // Nếu không có ảnh gốc, tự động chuyển hướng về trang chủ
    useEffect(() => {
        if (!image) {
            navigate("/");
        }
    }, [image, navigate]);

    return (
        <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]">
            {/* Image Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Original Image */}
                <div className="flex flex-col">
                    <p className="font-semibold text-gray-600 mb-2">Original</p>
                    {image ? (
                        <img
                            src={image ? URL.createObjectURL(image) : ""}
                            alt="original"
                            className="rounded-md w-full object-cover shadow-md"
                        />
                    ) : (
                        <div className="text-red-500 font-semibold">No original image found.</div>
                    )}
                </div>

                {/* Result Image */}
                <div className="flex flex-col">
                    <p className="font-semibold text-gray-600 mb-2">Background Removed</p>
                    <div className="rounded-md border border-gray-300 h-full bg-layer relative overflow-hidden min-h-[300px] flex items-center justify-center">
                        {resultImage ? (
                            <img
                                src={resultImage ? resultImage : ""}
                                alt="result"
                                className="w-full object-cover rounded-md shadow-md"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <div className="border-4 border-indigo-600 rounded-full h-12 w-12 border-t-transparent animate-spin mb-3"></div>
                                <span className="text-sm font-medium">Processing image...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            {resultImage && (
                <div className="flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="border border-indigo-500 text-indigo-600 font-semibold py-2 px-4 rounded-full text-lg hover:bg-indigo-50 transition-all duration-300"
                    >
                        Try another Image
                    </button>
                    <a
                        href={resultImage}
                        download="background-removed.png"
                        className="py-3 px-6 text-center text-white font-semibold rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300 transform hover:scale-105"
                    >
                        Download Image
                    </a>
                </div>
            )}
        </div>
    );
};

export default Result;
