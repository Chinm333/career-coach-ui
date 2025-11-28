import React, { createContext, useEffect, useState } from 'react'
import api, { setTokens, setRefresh } from '../api/apiClient'


export const AuthContext = createContext(null)


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)


    useEffect(() => {
        const access = localStorage.getItem('accessToken')
        const refresh = localStorage.getItem('refreshToken')
        if (access) setTokens(access)
        if (refresh) setRefresh(refresh)
        if (access) {
            try {
                const payload = JSON.parse(atob(access.split('.')[1]));
                setUser({ id: payload.userId, email: payload.email, role: payload.role })
            } catch (e) { }
        }
    }, [])


    const login = async ({ accessToken, refreshToken }) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        setTokens(accessToken)
        setRefresh(refreshToken)
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          setUser({ id: payload.userId, email: payload.email, role: payload.role })
        } catch (e) {
          setUser(null)
        }
    }


    const logout = async () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setTokens(null)
        setRefresh(null)
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}