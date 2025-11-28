import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    // Return a safe default instead of throwing
    return { user: null, login: async () => {}, logout: async () => {} }
  }
  return context
}