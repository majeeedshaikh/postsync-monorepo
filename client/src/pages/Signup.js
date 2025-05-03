"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaRocket } from "react-icons/fa"

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const { register, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName) {
      errors.fullName = "Full name is required"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        })

        navigate("/dashboard")
      } catch (err) {
        console.error("Registration error:", err)
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="logo" style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaRocket /> PostSync
        </div>
        <h2>Posting made effortless</h2>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create your account</h2>

          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>
              {error}
            </div>
          )}

          <div className="form-control">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {formErrors.fullName && (
              <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {formErrors.fullName}
              </div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {formErrors.email}
              </div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <div className="error-message" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {formErrors.password}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Create Account
          </button>

          <div className="auth-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
