"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaImage,
  FaVideo,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa"

const CreatePost = () => {
  const [accounts, setAccounts] = useState([])
  const [formData, setFormData] = useState({
    caption: "",
    platforms: [],
    isScheduled: false,
    scheduledDate: "",
    scheduledTime: "",
  })
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [postingStatus, setPostingStatus] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchAccounts()

    // Set default scheduled time to 30 minutes from now
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)

    setFormData({
      ...formData,
      scheduledDate: now.toISOString().split("T")[0],
      scheduledTime: now.toTimeString().slice(0, 5),
    })
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/accounts`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAccounts(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching accounts:", err)
      setError("Failed to load connected accounts")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePlatformToggle = (platform) => {
    const updatedPlatforms = formData.platforms.includes(platform)
      ? formData.platforms.filter((p) => p !== platform)
      : [...formData.platforms, platform]

    setFormData({
      ...formData,
      platforms: updatedPlatforms,
    })
  }

  const handleMediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit")
        return
      }

      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)|video\/(mp4|quicktime)/)) {
        setError("File type not supported. Please use JPG, PNG, GIF, or MP4")
        return
      }

      setMediaFile(file)
      setMediaPreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  const removeMedia = () => {
    setMediaFile(null)
    setMediaPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.platforms.length === 0) {
      setError("Please select at least one platform")
      return
    }

    if (!formData.caption.trim()) {
      setError("Please enter a caption for your post")
      return
    }

    if (!mediaFile) {
      setError("Please select an image or video to post")
      return
    }

    if (formData.isScheduled && (!formData.scheduledDate || !formData.scheduledTime)) {
      setError("Please select a date and time for your scheduled post")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      setPostingStatus({})

      const token = localStorage.getItem("token")

      // Create form data for file upload
      const postFormData = new FormData()
      postFormData.append("caption", formData.caption)

      if (mediaFile) {
        postFormData.append("media", mediaFile)
      }

      // Handle different platforms
      for (const platform of formData.platforms) {
        try {
          setPostingStatus((prev) => ({ ...prev, [platform]: "posting" }))

          if (platform === "instagram") {
            // Post to Instagram
            const response = await axios.post("http://localhost:49152/api/instagram/post", postFormData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            })

            setPostingStatus((prev) => ({ ...prev, [platform]: "success" }))
          }
          // Add other platforms here when implemented
        } catch (err) {
          console.error(`Error posting to ${platform}:`, err)
          setPostingStatus((prev) => ({ ...prev, [platform]: "error" }))
          throw err
        }
      }

      setSuccess("Post created successfully!")

      // Reset form
      setFormData({
        caption: "",
        platforms: [],
        isScheduled: false,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
      })
      setMediaFile(null)
      setMediaPreview(null)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("Error creating post:", err)
      setError(err.response?.data?.message || "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram />
      case "twitter":
        return <FaTwitter />
      case "facebook":
        return <FaFacebook />
      default:
        return null
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "instagram":
        return "#E4405F"
      case "twitter":
        return "#1DA1F2"
      case "facebook":
        return "#1877F2"
      default:
        return "#6B7280"
    }
  }

  return (
    <div className="dashboard-card">
      <h3 className="text-xl font-semibold mb-4">Create New Post</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaCheckCircle className="mr-2" />
          <span>{success}</span>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          You don't have any connected social media accounts. Please connect at least one account to create posts.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              id="caption"
              name="caption"
              rows="4"
              placeholder="What's on your mind?"
              value={formData.caption}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            ></textarea>
            <div className="text-right text-sm text-gray-500 mt-1">{formData.caption.length} characters</div>
          </div>

          <div className="form-control mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Platforms</label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((account) => (
                <button
                  key={`${account.platform}-${account.accountId}`}
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                    formData.platforms.includes(account.platform)
                      ? `bg-[${getPlatformColor(account.platform)}] text-white`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    formData.platforms.includes(account.platform)
                      ? { backgroundColor: getPlatformColor(account.platform) }
                      : {}
                  }
                  onClick={() => handlePlatformToggle(account.platform)}
                  disabled={loading}
                >
                  {getPlatformIcon(account.platform)}
                  <span>{account.accountName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-control mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Media (Required)</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById("media-upload").click()}
            >
              <input
                type="file"
                id="media-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/quicktime"
                onChange={handleMediaChange}
                className="hidden"
                disabled={loading}
              />
              {mediaPreview ? (
                <div className="relative">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  ) : (
                    <video src={mediaPreview} controls className="max-h-64 mx-auto rounded-lg" />
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeMedia()
                    }}
                    disabled={loading}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-4xl text-gray-400 mb-2 flex">
                    <FaImage className="mr-2" />
                    <FaVideo />
                  </div>
                  <p className="text-gray-500">Click to upload an image or video</p>
                  <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF, MP4</p>
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <FaInfoCircle className="mr-1" />
              <span>Instagram requires media for posts. Maximum file size: 10MB.</span>
            </div>
          </div>

          <div className="form-control mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isScheduled"
                name="isScheduled"
                checked={formData.isScheduled}
                onChange={(e) => setFormData({ ...formData, isScheduled: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                disabled={true}
              />
              <label htmlFor="isScheduled" className="ml-2 block text-sm text-gray-700">
                Schedule for later (Coming Soon)
              </label>
            </div>
          </div>

          {formData.isScheduled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control">
                <label htmlFor="scheduledDate" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="mr-2" /> Date
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  disabled={loading || true}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required={formData.isScheduled}
                />
              </div>

              <div className="form-control">
                <label htmlFor="scheduledTime" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaClock className="mr-2" /> Time
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  disabled={loading || true}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required={formData.isScheduled}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={loading || accounts.length === 0 || !mediaFile}
            >
              {loading ? (
                <>
                  <FaSpinner className="inline animate-spin mr-2" />
                  {formData.isScheduled ? "Scheduling..." : "Posting..."}
                </>
              ) : formData.isScheduled ? (
                "Schedule Post"
              ) : (
                "Post Now"
              )}
            </button>
          </div>

          {/* Posting Status */}
          {Object.keys(postingStatus).length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Posting Status:</h4>
              <ul className="space-y-2">
                {Object.entries(postingStatus).map(([platform, status]) => (
                  <li key={platform} className="flex items-center">
                    <span className="mr-2">{getPlatformIcon(platform)}</span>
                    <span className="mr-2">{platform.charAt(0).toUpperCase() + platform.slice(1)}:</span>
                    {status === "posting" && <FaSpinner className="animate-spin text-yellow-500" />}
                    {status === "success" && <FaCheckCircle className="text-green-500" />}
                    {status === "error" && <FaExclamationTriangle className="text-red-500" />}
                    <span className="ml-2">
                      {status === "posting" && "Posting..."}
                      {status === "success" && "Posted successfully"}
                      {status === "error" && "Failed to post"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default CreatePost
