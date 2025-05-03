"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaInstagram, FaImage, FaVideo, FaTimes, FaCalendarAlt, FaClock } from "react-icons/fa"

const SchedulerForm = ({ onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    text: "",
    platforms: [],
    scheduledDate: "",
    scheduledTime: "",
    media: [],
  })

  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mediaFiles, setMediaFiles] = useState([])
  const [mediaPreview, setMediaPreview] = useState([])
  const [characterCount, setCharacterCount] = useState(0)

  useEffect(() => {
    fetchAccounts()

    // Set initial data if provided (for editing)
    if (initialData) {
      const scheduledDateTime = new Date(initialData.scheduledTime)

      setFormData({
        text: initialData.content.text,
        platforms: initialData.platforms,
        scheduledDate: scheduledDateTime.toISOString().split("T")[0],
        scheduledTime: scheduledDateTime.toTimeString().slice(0, 5),
        media: initialData.content.media || [],
      })

      setCharacterCount(initialData.content.text.length)

      // Set media previews for existing media
      if (initialData.content.media && initialData.content.media.length > 0) {
        setMediaPreview(
          initialData.content.media.map((media) => ({
            url: media.url,
            type: media.type,
          })),
        )
      }
    } else {
      // Set default scheduled time to 30 minutes from now
      const now = new Date()
      now.setMinutes(now.getMinutes() + 30)

      setFormData({
        ...formData,
        scheduledDate: now.toISOString().split("T")[0],
        scheduledTime: now.toTimeString().slice(0, 5),
      })
    }
  }, [initialData])

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/accounts`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAccounts(response.data)
    } catch (err) {
      console.error("Error fetching accounts:", err)
      setError("Failed to load connected accounts")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "text") {
      setCharacterCount(value.length)
    }

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
    const files = Array.from(e.target.files)

    // Add to media files array for form submission
    setMediaFiles([...mediaFiles, ...files])

    // Create preview URLs
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }))

    setMediaPreview([...mediaPreview, ...newPreviews])
  }

  const removeMedia = (index) => {
    const updatedFiles = [...mediaFiles]
    updatedFiles.splice(index, 1)
    setMediaFiles(updatedFiles)

    const updatedPreviews = [...mediaPreview]
    updatedPreviews.splice(index, 1)
    setMediaPreview(updatedPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.platforms.length === 0) {
      setError("Please select at least one platform")
      return
    }

    if (!formData.text.trim()) {
      setError("Please enter some text for your post")
      return
    }

    if (!formData.scheduledDate || !formData.scheduledTime) {
      setError("Please select a date and time for your post")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")

      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append("text", formData.text)
      formDataToSend.append("platforms", JSON.stringify(formData.platforms))

      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
      formDataToSend.append("scheduledTime", scheduledDateTime.toISOString())

      // Add media files
      mediaFiles.forEach((file) => {
        formDataToSend.append("media", file)
      })

      // If editing, use PUT request
      const url = initialData
        ? `http://localhost:49152/api/posts/posts/${initialData._id}`
        : "http://localhost:49152/api/posts/schedule"

      const method = initialData ? "put" : "post"

      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data)
      }

      // Reset form if not editing
      if (!initialData) {
        setFormData({
          text: "",
          platforms: [],
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime,
          media: [],
        })
        setMediaFiles([])
        setMediaPreview([])
        setCharacterCount(0)
      }
    } catch (err) {
      console.error("Error scheduling post:", err)
      setError(err.response?.data?.message || "Failed to schedule post")
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = (platform) => {
    return <FaInstagram />
  }

  const getPlatformColor = (platform) => {
    return "#E4405F"
  }

  return (
    <div className="dashboard-card">
      <h3 className="text-xl font-semibold mb-4">{initialData ? "Edit Post" : "Schedule a Post"}</h3>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {accounts.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          You don't have any connected Instagram accounts. Please connect your Instagram account to schedule posts.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="text">Post Content</label>
          <textarea
            id="text"
            name="text"
            rows="4"
            placeholder="What's on your mind?"
            value={formData.text}
            onChange={handleChange}
            disabled={loading}
            required
          ></textarea>
          <div className="text-right text-sm text-gray-500 mt-1">{characterCount} characters</div>
        </div>

        <div className="form-control">
          <label>Select Platforms</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {accounts
              .filter((account) => account.platform === "instagram")
              .map((account) => (
                <button
                  key={`${account.platform}-${account.accountId}`}
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                    formData.platforms.includes(account.platform)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handlePlatformToggle(account.platform)}
                  disabled={loading}
                >
                  <span
                    style={{
                      color: formData.platforms.includes(account.platform)
                        ? "white"
                        : getPlatformColor(account.platform),
                    }}
                  >
                    {getPlatformIcon(account.platform)}
                  </span>
                  <span>{account.accountName}</span>
                </button>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-control">
            <label htmlFor="scheduledDate">
              <FaCalendarAlt className="inline mr-2" /> Date
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              disabled={loading}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="scheduledTime">
              <FaClock className="inline mr-2" /> Time
            </label>
            <input
              type="time"
              id="scheduledTime"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="form-control mt-4">
          <label>Media (Optional)</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById("media-upload").click()}
          >
            <input
              type="file"
              id="media-upload"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              className="hidden"
              disabled={loading}
            />
            <div className="flex flex-col items-center">
              <div className="text-4xl text-gray-400 mb-2">
                <FaImage className="inline mr-2" />
                <FaVideo className="inline" />
              </div>
              <p className="text-gray-500">Click to upload images or videos</p>
              <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF, MP4</p>
            </div>
          </div>

          {mediaPreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaPreview.map((media, index) => (
                <div key={index} className="relative">
                  {media.type === "image" ? (
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video src={media.url} className="w-full h-32 object-cover rounded-lg" controls />
                  )}
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={() => removeMedia(index)}
                    disabled={loading}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading || accounts.length === 0}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {initialData ? "Updating..." : "Scheduling..."}
              </>
            ) : initialData ? (
              "Update Post"
            ) : (
              "Schedule Post"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SchedulerForm
