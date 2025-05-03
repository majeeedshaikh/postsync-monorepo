"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa"
import SchedulerForm from "./SchedulerForm"

// Setup the localizer
const localizer = momentLocalizer(moment)

const CalendarView = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [view, setView] = useState("month")
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await axios.get("http://localhost:49152/api/posts/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setPosts(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token")

      await axios.delete(`http://localhost:49152/api/posts/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Update posts list
      setPosts(posts.filter((post) => post._id !== postId))

      // Close modal if open
      setIsModalOpen(false)
      setSelectedPost(null)
    } catch (err) {
      console.error("Error deleting post:", err)
      setError("Failed to delete post")
    }
  }

  const handleEditSuccess = (updatedPost) => {
    // Update posts list
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)))

    // Close edit modal
    setIsEditModalOpen(false)
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "facebook":
        return <FaFacebook />
      case "twitter":
        return <FaTwitter />
      case "linkedin":
        return <FaLinkedin />
      case "instagram":
        return <FaInstagram />
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
      case "twitter":
        return "#1DA1F2"
      case "linkedin":
        return "#0A66C2"
      case "instagram":
        return "#E4405F"
      case "pinterest":
        return "#BD081C"
      case "tiktok":
        return "#000000"
      default:
        return "#1877F2"
    }
  }

  // Format posts for calendar
  const calendarEvents = posts.map((post) => ({
    id: post._id,
    title: post.content.text.substring(0, 30) + (post.content.text.length > 30 ? "..." : ""),
    start: new Date(post.scheduledTime),
    end: new Date(new Date(post.scheduledTime).getTime() + 30 * 60000), // Add 30 minutes
    post: post,
  }))

  // Custom event component for the calendar
  const EventComponent = ({ event }) => {
    const { post } = event

    return (
      <div className="flex items-center p-1">
        <div className="flex space-x-1 mr-1">
          {post.platforms.map((platform) => (
            <span key={platform} style={{ color: getPlatformColor(platform) }}>
              {getPlatformIcon(platform)}
            </span>
          ))}
        </div>
        <span className="truncate">{event.title}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dashboard-card">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-card">
      <h3 className="text-xl font-semibold mb-4">Content Calendar</h3>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={["month", "week", "day", "agenda"]}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          components={{
            event: EventComponent,
          }}
          onSelectEvent={(event) => {
            setSelectedPost(event.post)
            setIsModalOpen(true)
          }}
        />
      </div>

      {/* Post Details Modal */}
      {isModalOpen && selectedPost && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Post Details</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                  {selectedPost.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 rounded-full text-white text-xs flex items-center"
                      style={{ backgroundColor: getPlatformColor(platform) }}
                    >
                      {getPlatformIcon(platform)}
                      <span className="ml-1">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                    </span>
                  ))}
                </div>

                <div className="text-sm text-gray-500 mb-2">
                  Scheduled for: {moment(selectedPost.scheduledTime).format("MMMM D, YYYY [at] h:mm A")}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">{selectedPost.content.text}</div>

                {selectedPost.content.media && selectedPost.content.media.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Media</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPost.content.media.map((media, index) => (
                        <div key={index}>
                          {media.type === "image" ? (
                            <img
                              src={media.url || "/placeholder.svg"}
                              alt={`Media ${index}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <video src={media.url} className="w-full h-32 object-cover rounded-lg" controls />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.status === "published" && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Performance</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">{selectedPost.analytics?.likes || 0}</div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">{selectedPost.analytics?.comments || 0}</div>
                        <div className="text-xs text-gray-500">Comments</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">{selectedPost.analytics?.shares || 0}</div>
                        <div className="text-xs text-gray-500">Shares</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                {selectedPost.status === "scheduled" && (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsModalOpen(false)
                        setIsEditModalOpen(true)
                      }}
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDeletePost(selectedPost._id)}>
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </>
                )}
                <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {isEditModalOpen && selectedPost && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "700px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Post</h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <SchedulerForm initialData={selectedPost} onSuccess={handleEditSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView
