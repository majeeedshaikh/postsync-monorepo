"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const res = await axios.get("http://localhost:49152/api/user", config)

        setUser(res.data)
        setIsAuthenticated(true)
        setLoading(false)
      } catch (err) {
        localStorage.removeItem("token")
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Register user
  const register = async (formData) => {
    try {
      setError(null)
      const res = await axios.post("http://localhost:49152/api/auth/signup", formData)

      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration")
      throw err
    }
  }

  // Login user
  const login = async (formData) => {
    try {
      setError(null)
      const res = await axios.post("http://localhost:49152/api/auth/login", formData)

      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)

      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials")
      throw err
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
