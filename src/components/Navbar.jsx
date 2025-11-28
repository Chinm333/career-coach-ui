import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


export default function Navbar() {
    const { user, logout } = useAuth()
    return (
        <nav className="bg-white/60 backdrop-blur-lg shadow-lg sticky top-0 z-30 border-b border-gray-200">
            <div className="container mx-auto py-3 px-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-300 shadow-md">
                        <img src="/logo.png" alt="logo" className="h-7 w-7 rounded-full object-cover" />
                    </div>
                    <Link to="/" className="font-extrabold text-2xl text-primary-dark tracking-tight select-none">Career Coach</Link>
                </div>
                <div>
                    {!user ? (
                        <div className="flex gap-4">
                            <Link to="/login" className="py-1.5 px-4 rounded-lg bg-primary text-white shadow-sm hover:bg-primary-dark transition text-sm font-medium">Login</Link>
                            <Link to="/register/candidate" className="py-1.5 px-4 rounded-lg bg-white/80 border border-primary text-primary-dark shadow-sm hover:bg-primary hover:text-white transition text-sm font-medium">Register</Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">{user.email}</span>
                            <button onClick={logout} className="py-1.5 px-4 rounded-lg text-red-500 border border-red-200 bg-white/80 font-medium hover:bg-red-50 transition">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}