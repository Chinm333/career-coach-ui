import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


export default function ProtectedRoute({ children, role }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    if (role && user.role !== role) return <div className="p-6">Forbidden</div>
    return children
}