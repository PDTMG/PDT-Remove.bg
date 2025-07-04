"use client"

import { useContext, useState } from "react"
import { Menu, X, User, LogIn, UserPlus, Heart, Sparkles } from "lucide-react"
import { assets } from "../assets/assets"
import { Link } from "react-router-dom"
import { SignedIn, SignedOut, useClerk, UserButton, useUser } from "@clerk/clerk-react"
import { AppContext } from "../context/AppContext"

const Menubar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { openSignIn, openSignUp } = useClerk()
    const { user } = useUser()
    const { credit } = useContext(AppContext)

    const openRegister = () => {
        setMenuOpen(false)
        openSignUp({})
    }

    const openLogin = () => {
        setMenuOpen(false)
        openSignIn({})
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-2 border-green-100 px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Magical Logo */}
                <Link className="flex items-center space-x-3 group" to="/">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-300 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                        <img
                            src={assets.logo || "/placeholder.svg"}
                            alt="Logo"
                            className="relative h-10 w-10 object-contain rounded-xl border-2 border-green-200 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                                Remove.
                            </span>
                            <span className="text-2xl font-bold text-gray-500">bg</span>
                            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse ml-1" />
                        </div>
                        <div className="text-xs text-gray-500">✨ Made with magic</div>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <SignedOut>
                        <button
                            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-green-50"
                            onClick={openLogin}
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </button>
                        <button
                            className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden"
                            onClick={openRegister}
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            <UserPlus className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Sign Up</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                        </button>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center gap-4">
                            {/* Magical Credits Display */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full shadow-lg border-2 border-green-200">
                                <div className="relative">
                                    <img src={assets.credits || "/placeholder.svg"} alt="credit" className="w-5 h-5" />
                                    <div className="absolute inset-0 bg-yellow-300/20 rounded-full animate-pulse"></div>
                                </div>
                                <span className="text-sm font-bold text-green-700">{credit || 0}</span>
                                <span className="text-xs text-gray-600">credits</span>
                                <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                            </div>

                            {/* User Greeting */}
                            <div className="hidden lg:flex items-center gap-2 text-gray-600">
                                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                                <span className="text-sm">Hello, </span>
                                <span className="font-semibold text-green-700">{user?.firstName || "Friend"}</span>
                            </div>

                            {/* Enhanced User Button */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-300/30 to-blue-300/30 rounded-full blur-lg animate-pulse"></div>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox:
                                                "relative w-10 h-10 rounded-full ring-2 ring-green-300 hover:ring-green-400 transition-all duration-200 border-2 border-green-200 shadow-lg",
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </SignedIn>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 rounded-xl bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-all duration-200 shadow-lg"
                    >
                        {menuOpen ? <X size={24} className="text-green-600" /> : <Menu size={24} className="text-green-600" />}
                    </button>
                </div>

                {/* Magical Mobile Menu */}
                {menuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t-2 border-green-100 md:hidden">
                        <div className="p-6 space-y-4">
                            <SignedOut>
                                <button
                                    className="flex items-center gap-3 w-full text-left text-gray-600 hover:text-green-600 font-medium py-3 px-4 rounded-xl hover:bg-green-50 transition-all duration-200 border-2 border-green-100 hover:border-green-200"
                                    onClick={openLogin}
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </button>
                                <button
                                    className="flex items-center gap-3 w-full bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg relative overflow-hidden"
                                    onClick={openRegister}
                                >
                                    <UserPlus className="w-5 h-5" />
                                    <span>Sign Up</span>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                                </button>
                            </SignedOut>

                            <SignedIn>
                                <div className="space-y-4">
                                    {/* Mobile Credits */}
                                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 rounded-xl border-2 border-green-200 shadow-lg">
                                        <img src={assets.credits || "/placeholder.svg"} alt="credit" className="w-5 h-5" />
                                        <span className="font-bold text-green-700">{credit || 0} credits</span>
                                        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                                    </div>

                                    {/* Mobile User Info */}
                                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border-2 border-green-100">
                                        <User className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-600">
                                            Hello, <span className="font-semibold text-green-700">{user?.firstName || "Friend"}</span>
                                        </span>
                                        <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                                    </div>

                                    {/* Mobile User Button */}
                                    <div className="px-4">
                                        <UserButton />
                                    </div>
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Menubar
