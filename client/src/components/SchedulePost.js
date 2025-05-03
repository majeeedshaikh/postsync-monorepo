"use client"

import { useState } from "react"
import { FaTimes, FaImage } from "react-icons/fa"

const SchedulePost = ({ isOpen, onClose, onSchedule }) => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    platform: "facebook",
    scheduledDate: "",
    scheduledTime: "",
    image: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPostData({
      ...postData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPostData({
        ...postData,
        image: e.target.files[0],
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Combine date and time
    const scheduledDateTime = new Date(`${postData.scheduledDate}T${postData.scheduledTime}`)

    onSchedule({
      ...postData,
      scheduledDateTime,
    })

    // Reset form
    setPostData({
      title: "",
      content: "",
      platform: "facebook",
      scheduledDate: "",
      scheduledTime: "",
      image: null,
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Schedule a Post</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="title">Post Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter post title"
                value={postData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="content">Post Content</label>
              <textarea
                id="content"
                name="content"
                rows="4"
                placeholder="What's on your mind?"
                value={postData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-control">
              <label htmlFor="platform">Platform</label>
              <select id="platform" name="platform" value={postData.platform} onChange={handleChange}>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="form-control" style={{ flex: 1 }}>
                <label htmlFor="scheduledDate">Date</label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={postData.scheduledDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control" style={{ flex: 1 }}>
                <label htmlFor="scheduledTime">Time</label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={postData.scheduledTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="image">Image (Optional)</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                  border: "2px dashed var(--border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("image").click()}
              >
                {postData.image ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(postData.image) || "/placeholder.svg"}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "0.5rem" }}
                    />
                    <p>{postData.image.name}</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--text-light)" }}>
                    <FaImage size={24} style={{ marginBottom: "0.5rem" }} />
                    <p>Click to upload an image</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Schedule Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SchedulePost
