"use client"

import { useState } from "react"
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa"

const AccountManager = () => {
  // Sample connected accounts data
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      platform: "facebook",
      name: "Brand Page",
      status: "Connected",
      username: "yourbrand",
    },
    {
      id: 2,
      platform: "instagram",
      name: "Brand Instagram",
      status: "Connected",
      username: "@yourbrand",
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    platform: "facebook",
    name: "",
    username: "",
  })

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "facebook":
        return <FaFacebook />
      case "instagram":
        return <FaInstagram />
      case "twitter":
        return <FaTwitter />
      case "linkedin":
        return <FaLinkedin />
      case "pinterest":
        return <FaPinterest />
      case "tiktok":
        return <FaTiktok />
      default:
        return <FaFacebook />
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "facebook":
        return "#1877F2"
      case "instagram":
        return "#E4405F"
      case "twitter":
        return "#1DA1F2"
      case "linkedin":
        return "#0077B5"
      case "pinterest":
        return "#E60023"
      case "tiktok":
        return "#000000"
      default:
        return "#1877F2"
    }
  }

  const handleAddAccount = () => {
    // In a real app, this would authenticate with the platform
    // For now, we'll just add it to our local state
    const newAccountData = {
      id: Date.now(),
      platform: newAccount.platform,
      name: newAccount.name,
      status: "Connected",
      username: newAccount.username,
    }

    setConnectedAccounts([...connectedAccounts, newAccountData])
    setNewAccount({
      platform: "facebook",
      name: "",
      username: "",
    })
    setIsAddModalOpen(false)
  }

  const handleRemoveAccount = (id) => {
    // In a real app, this would revoke access
    // For now, we'll just remove it from our local state
    setConnectedAccounts(connectedAccounts.filter((account) => account.id !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewAccount({
      ...newAccount,
      [name]: value,
    })
  }

  return (
    <div>
      <div className="dashboard-card">
        <h3>Connected Accounts</h3>
        <p className="mb-4">Manage your connected social media accounts</p>

        {connectedAccounts.map((account) => (
          <div className="account-card" key={account.id}>
            <div
              className="account-icon"
              style={{ backgroundColor: getPlatformColor(account.platform), color: "white" }}
            >
              {getPlatformIcon(account.platform)}
            </div>
            <div className="account-info">
              <div className="account-name">{account.name}</div>
              <div className="account-status">
                {account.status} • {account.username}
              </div>
            </div>
            <div className="account-actions">
              <button className="account-action-btn" title="Edit">
                <FaEdit />
              </button>
              <button className="account-action-btn" title="Remove" onClick={() => handleRemoveAccount(account.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        <div className="add-account-card" onClick={() => setIsAddModalOpen(true)}>
          <div className="add-account-icon">
            <FaPlus />
          </div>
          <div className="add-account-text">Connect a new account</div>
        </div>
      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Connect a Social Media Account</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddAccount()
                }}
              >
                <div className="form-control">
                  <label htmlFor="platform">Platform</label>
                  <select id="platform" name="platform" value={newAccount.platform} onChange={handleChange}>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div className="form-control">
                  <label htmlFor="name">Account Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Brand Page, Personal Profile"
                    value={newAccount.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="e.g. @yourbrand"
                    value={newAccount.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaCheck /> Connect Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountManager
