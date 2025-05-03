"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import {
  FaInstagram,
  FaLinkedin,
  FaFacebookF,
  FaTwitter,
  FaPlus,
  FaTrash,
  FaSync,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa"

const PLATFORMS = [
  { key: "instagram", label: "Instagram", Icon: FaInstagram, color: "#E4405F" },
  { key: "linkedin",  label: "LinkedIn",  Icon: FaLinkedin,  color: "#0077B5" },
  { key: "facebook",  label: "Facebook",  Icon: FaFacebookF,  color: "#4267B2" },
  { key: "twitter",   label: "Twitter",   Icon: FaTwitter,   color: "#1DA1F2" }
]

export default function SocialAccounts() {
  const [accounts, setAccounts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [success, setSuccess]       = useState(null)
  const [connecting, setConnecting] = useState(null)
  const location = useLocation()

  const API = process.env.REACT_APP_API_BASE_URL

  // Fetch connected accounts
  const fetchAccounts = async () => {
    setLoading(true); setError(null)
    try {
      const token = localStorage.getItem("token")
      const { data } = await axios.get(
          `${API}/api/auth/accounts`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAccounts(data)
    } catch (err) {
      console.error(err)
      setError("Failed to load connected accounts")
    } finally {
      setLoading(false)
    }
  }

  // Handle OAuth callback messages
  useEffect(() => {
      const params = new URLSearchParams(location.search)
    const ok  = params.get("accountConnected")
    const err = params.get("error")
    const msg = params.get("message")
    if (ok) {
      setSuccess(`Successfully connected ${ok}!`)
      params.delete("accountConnected")
      params.delete("message")
      fetchAccounts()
    } else if (err) {
      setError(msg || `Error connecting: ${err}`)
      params.delete("error")
      params.delete("message")
    }
       // remove the query params from the URL
     window.history.replaceState(null, "", window.location.pathname)
   }, [location.search])

  // Initial load
  useEffect(() => {
    fetchAccounts()
  }, [])

  // Redirect to backend OAuth start (includes token)
  const handleConnect = (platform) => {
    setConnecting(platform)
    setError(null)
    setSuccess(null)
    const token = localStorage.getItem("token")
    window.location.href = `${API}/api/auth/${platform}?token=${token}`
  }


  // Disconnect
  const handleDisconnect = async (platform, accountId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${API}/api/auth/disconnect/${platform}/${accountId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess(`Disconnected ${platform}`)
      setAccounts(a =>
        a.filter(x => !(x.platform === platform && x.accountId === accountId))
      )
    } catch (err) {
      console.error(err)
      setError(`Failed to disconnect ${platform}`)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="alert alert-error flex items-center space-x-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success flex items-center space-x-2">
          <FaCheckCircle />
          <span>{success}</span>
        </div>
      )}

      {/* Connected accounts */}
      {accounts.map((acct) => {
        const P = PLATFORMS.find((p) => p.key === acct.platform)
        return (
          <div
            key={`${acct.platform}-${acct.accountId}`}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-full text-white"
                style={{ backgroundColor: P.color }}
              >
                <P.Icon />
              </div>
              <div>
                <div className="font-medium">{acct.accountName}</div>
                <div className="text-sm text-gray-600">{acct.username}</div>
              </div>
            </div>
            <button
              className="btn btn-outline btn-sm flex items-center space-x-1"
              onClick={() =>
                handleDisconnect(acct.platform, acct.accountId)
              }
            >
              <FaTrash />
              <span>Disconnect</span>
            </button>
          </div>
        )
      })}

      {/* Connect buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map(({ key, label, Icon, color }) => {
          const isConnected = accounts.some((a) => a.platform === key)
          const isConnecting = connecting === key

          return (
            <div
              key={key}
              className={`p-4 border rounded-lg flex flex-col items-center ${
                isConnected ? "bg-gray-100" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div
                className="p-3 rounded-full text-white mb-2"
                style={{ backgroundColor: color }}
              >
                <Icon size={24} />
              </div>
              <div className="font-medium mb-1">{label}</div>
              <div className="text-sm text-gray-500 mb-3">
                {isConnected ? "Connected" : "Not connected"}
              </div>
              <button
                onClick={() => handleConnect(key)}
                disabled={isConnected || isConnecting}
                className={`btn btn-sm flex items-center space-x-1 ${
                  isConnected
                    ? "btn-secondary"
                    : "btn-primary hover:btn-primary-focus"
                }`}
              >
                {isConnecting ? (
                  <>
                    <FaSync className="animate-spin" />{" "}
                    <span>Connecting...</span>
                  </>
                ) : isConnected ? (
                  <span>Already Connected</span>
                ) : (
                  <>
                    <FaPlus /> <span>Connect</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
