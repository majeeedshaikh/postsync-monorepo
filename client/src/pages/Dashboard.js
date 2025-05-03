"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useLocation } from "react-router-dom"
import {
  FaRocket,
  FaTachometerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaLink,
  FaCog,
  FaSignOutAlt,
  FaPen,
} from "react-icons/fa"
import SocialAccounts from "../components/SocialAccounts"
import CalendarView from "../components/CalendarView"
import SocialDashboard from "../components/SocialDashboard"

const Dashboard = () => {
  const { user, logout } = useAuth()

 
  const [activeNav, setActiveNav] = useState("dashboard")
  const location = useLocation()
  const navigate = useNavigate()

// Auto-switch to Manage Accounts tab when OAuth redirects you back with ?accountConnected or ?error
  useEffect(() => {
      const params = new URLSearchParams(location.search)
      if (params.has("accountConnected") || params.has("error")) {
        setActiveNav("accounts")
        // remove the query string so it doesn’t stick around
        window.history.replaceState(null, "", window.location.pathname)
      }
    }, [location.search])
  

  const handleLogout = () => {
    logout()
  }

  const getUserInitials = () => {
    if (!user || !user.fullName) return "U"
    return user.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }

  const handleCreatePost = () => {
    navigate("/create-post")
  }

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-logo">
          <FaRocket /> PostSync
        </div>
        <div className="dashboard-nav">
          <div
            className={`dashboard-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveNav("dashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </div>
          <div
            className={`dashboard-nav-item ${activeNav === "calendar" ? "active" : ""}`}
            onClick={() => setActiveNav("calendar")}
          >
            <FaCalendarAlt /> Content Calendar
          </div>
          <div
            className={`dashboard-nav-item ${activeNav === "analytics" ? "active" : ""}`}
            onClick={() => setActiveNav("analytics")}
          >
            <FaChartLine /> Analytics
          </div>
          <div
            className={`dashboard-nav-item ${activeNav === "accounts" ? "active" : ""}`}
            onClick={() => setActiveNav("accounts")}
          >
            <FaLink /> Manage Accounts
          </div>
          <div
            className={`dashboard-nav-item ${activeNav === "settings" ? "active" : ""}`}
            onClick={() => setActiveNav("settings")}
          >
            <FaCog /> Settings
          </div>
        </div>
        <div className="dashboard-user">
          <div className="dashboard-user-avatar">{getUserInitials()}</div>
          <div className="dashboard-user-info">
            <div className="dashboard-user-name">{user?.fullName}</div>
            <div className="dashboard-user-email">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-light)" }}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {activeNav === "dashboard" && "Welcome back, " + (user?.fullName.split(" ")[0] || "User") + "!"}
            {activeNav === "calendar" && "Content Calendar"}
            {activeNav === "analytics" && "Analytics"}
            {activeNav === "accounts" && "Manage Social Accounts"}
            {activeNav === "settings" && "Settings"}
          </h1>
          <div className="dashboard-actions">
            {(activeNav === "dashboard" || activeNav === "calendar" || activeNav === "analytics") && (
              <button className="btn btn-primary" onClick={handleCreatePost}>
                <FaPen className="mr-1" /> Create Post
              </button>
            )}
          </div>
        </div>

        {activeNav === "dashboard" && (
          <div className="dashboard-grid">
            <div style={{ gridColumn: "span 3" }}>
              <SocialDashboard />
            </div>
          </div>
        )}

        {activeNav === "calendar" && (
          <div className="dashboard-grid">
            <div style={{ gridColumn: "span 3" }}>
              <CalendarView />
            </div>
          </div>
        )}

        {activeNav === "analytics" && (
          <div className="dashboard-grid">
            <div style={{ gridColumn: "span 3" }}>
              <SocialDashboard />
            </div>
          </div>
        )}

        {activeNav === "accounts" && (
          <div className="dashboard-grid">
            <div style={{ gridColumn: "span 3" }}>
              <SocialAccounts />
            </div>
          </div>
        )}

        {activeNav === "settings" && (
          <div className="dashboard-grid">
            <div className="dashboard-card" style={{ gridColumn: "span 3" }}>
              <h3 className="text-xl font-semibold mb-4">Settings</h3>
              <p>Account settings and preferences will be available here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
