import React from 'react'

/**
 * Navbar Component
 * 
 * Why a separate file? 
 * 1. Cleanliness: App.jsx doesn't get cluttered.
 * 2. Reusability: We can use this Navbar on other pages (like a Settings page) easily.
 * 3. Focus: When you want to fix the Navbar, you know exactly which file to open.
 */
/**
 * WHAT ARE PROPS?
 * Props (short for "Properties") are how we pass data OR functions 
 * from a Parent (App.jsx) to a Child (Navbar.jsx).
 * 
 * Here, we receive 'onLogoClick' so the navbar can tell the App 
 * "Hey, the user clicked the logo, go home!"
 */
const Navbar = ({ onLogoClick }) => {
    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl px-6 py-3 shadow-2xl transition-all">
                <div
                    onClick={onLogoClick}
                    className="flex items-center gap-2 cursor-pointer group hover:scale-105 transition-all"
                >
                    {/* Logo Icon */}
                    <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-white transition-all">
                        VisionChat AI
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent">History</button>
                    <button className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all cursor-pointer">
                        Settings
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
