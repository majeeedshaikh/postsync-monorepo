"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaUsers,
  FaEye,
  FaChartLine,
  FaHeart,
  FaComment,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const SocialDashboard = () => {
  const [activeTab, setActiveTab] = useState("instagram")
  const [profile, setProfile] = useState(null)
  const [insights, setInsights] = useState(null)
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [activeTab])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")

      if (activeTab === "instagram") {
        // Fetch Instagram data
        const [profileRes, insightsRes, mediaRes] = await Promise.all([
          axios.get("http://localhost:49152/api/instagram/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:49152/api/instagram/insights", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:49152/api/instagram/media", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setProfile(profileRes.data)
        setInsights(insightsRes.data)
        setMedia(mediaRes.data)
      } else {
        // For Twitter and Facebook, we'll use placeholder data for now
        setProfile({
          username: `Your ${activeTab} Account`,
          accountName: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page`,
        })

        setInsights({
          followers_count: 0,
          follows_count: 0,
          media_count: 0,
          impressions: { day: 0, week: 0, month: 0 },
          reach: { day: 0, week: 0, month: 0 },
          profile_views: { day: 0, week: 0, month: 0 },
          engagement_rate: "0.00",
          follower_growth: Array(12)
            .fill()
            .map((_, i) => ({
              date: `2023-${String(i + 1).padStart(2, "0")}`,
              count: 0,
            })),
        })

        setMedia([])
      }
    } catch (err) {
      console.error(`Error fetching ${activeTab} data:`, err)
      setError(`Failed to load ${activeTab} data. ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
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

  const getPlatformIcon = (platform, size = 24) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram size={size} />
      case "twitter":
        return <FaTwitter size={size} />
      case "facebook":
        return <FaFacebook size={size} />
      default:
        return null
    }
  }

  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A"

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Prepare chart data
  const followerChartData = {
    labels:
      insights?.follower_growth?.map((item) => {
        const date = new Date(item.date)
        return `${date.getMonth() + 1}/${date.getDate()}`
      }) || [],
    datasets: [
      {
        label: "Followers",
        data: insights?.follower_growth?.map((item) => item.count) || [],
        borderColor: getPlatformColor(activeTab),
        backgroundColor: `${getPlatformColor(activeTab)}33`,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#111",
        bodyColor: "#333",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#9CA3AF",
          callback: (value) => formatNumber(value),
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="dashboard-card">
        <div className="flex justify-center items-center p-8">
          <FaSpinner className="animate-spin text-primary text-4xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Platform Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === "instagram" ? "bg-[#E4405F] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("instagram")}
        >
          <FaInstagram className="mr-2" /> Instagram
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === "twitter" ? "bg-[#1DA1F2] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("twitter")}
          disabled={true}
        >
          <FaTwitter className="mr-2" /> Twitter (Coming Soon)
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === "facebook" ? "bg-[#1877F2] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("facebook")}
          disabled={true}
        >
          <FaFacebook className="mr-2" /> Facebook (Coming Soon)
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Overview */}
      <div className="dashboard-card">
        <div className="flex items-center mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: getPlatformColor(activeTab) }}
          >
            {getPlatformIcon(activeTab)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{profile?.username || `Your ${activeTab} Account`}</h3>
            <p className="text-gray-500">
              {profile?.name || `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Account`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center text-gray-500 mb-2">
              <FaUsers className="mr-2" /> Followers
            </div>
            <div className="text-2xl font-bold">{formatNumber(insights?.followers_count || 0)}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center text-gray-500 mb-2">
              <FaEye className="mr-2" /> Impressions
            </div>
            <div className="text-2xl font-bold">
              {formatNumber(
                insights?.impressions && Object.values(insights.impressions).length > 0
                  ? Object.values(insights.impressions)[0]
                  : 0,
              )}
            </div>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center text-gray-500 mb-2">
              <FaChartLine className="mr-2" /> Engagement
            </div>
            <div className="text-2xl font-bold">{insights?.engagement_rate || "0.00"}%</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center text-gray-500 mb-2">
              <FaCalendarAlt className="mr-2" /> Posts
            </div>
            <div className="text-2xl font-bold">{formatNumber(insights?.media_count || 0)}</div>
          </div>
        </div>
      </div>

      {/* Follower Growth Chart */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold mb-4">Follower Growth</h3>
        {insights?.follower_growth && insights.follower_growth.length > 0 ? (
          <div className="h-64">
            <Line data={followerChartData} options={chartOptions} />
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <FaInfoCircle className="text-gray-400 mr-2" />
            <span className="text-gray-500">Follower growth data not available</span>
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>

        {media && media.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                  <img
                    src={post.media_url || post.thumbnail_url || "/placeholder.svg?height=300&width=300"}
                    alt={post.caption || "Instagram post"}
                    className="w-full h-48 object-cover"
                  />
                </a>
                <div className="p-3">
                  <p className="text-sm text-gray-500 truncate">{post.caption || "No caption"}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FaHeart className="mr-1" /> {post.like_count || 0}
                      <FaComment className="ml-2 mr-1" /> {post.comments_count || 0}
                    </div>
                    <div>{formatDate(post.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            {activeTab === "instagram" ? (
              <>No posts found. Start posting to see your content here.</>
            ) : (
              <>Connect your {activeTab} account to see your posts.</>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialDashboard
