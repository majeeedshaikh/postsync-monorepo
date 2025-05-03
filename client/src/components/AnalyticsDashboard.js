"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaChartLine,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaEye,
} from "react-icons/fa"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null)
  const [platformData, setPlatformData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  useEffect(() => {
    fetchAnalyticsSummary()
  }, [])

  const fetchAnalyticsSummary = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await axios.get("http://localhost:49152/api/posts/analytics/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSummary(response.data)

      // Fetch data for the platform with the most posts
      const platforms = Object.entries(response.data.platformBreakdown)
        .filter(([_, count]) => count > 0)
        .sort(([_, countA], [__, countB]) => countB - countA)

      if (platforms.length > 0) {
        const topPlatform = platforms[0][0]
        setSelectedPlatform(topPlatform)
        fetchPlatformData(topPlatform)
      }

      setError(null)
    } catch (err) {
      console.error("Error fetching analytics summary:", err)
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  const fetchPlatformData = async (platform) => {
    try {
      // Check if we already have data for this platform
      if (platformData[platform]) {
        return
      }

      const token = localStorage.getItem("token")

      const response = await axios.get(`http://localhost:49152/api/posts/analytics/${platform}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setPlatformData((prev) => ({
        ...prev,
        [platform]: response.data,
      }))
    } catch (err) {
      console.error(`Error fetching ${platform} analytics:`, err)
      setError(`Failed to load ${platform} analytics data`)
    }
  }

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform)
    fetchPlatformData(platform)
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

  const getPlatformName = (platform) => {
    switch (platform) {
      case "facebook":
        return "Facebook"
      case "twitter":
        return "Twitter/X"
      case "linkedin":
        return "LinkedIn"
      case "instagram":
        return "Instagram"
      case "pinterest":
        return "Pinterest"
      case "tiktok":
        return "TikTok"
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1)
    }
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

  if (!summary) {
    return (
      <div className="dashboard-card">
        <h3 className="text-xl font-semibold mb-4">Analytics</h3>
        <div className="text-center p-8 text-gray-500">
          No analytics data available. Start posting to see your performance metrics.
        </div>
      </div>
    )
  }

  // Prepare platform breakdown data for pie chart
  const platformLabels = Object.keys(summary.platformBreakdown)
    .filter((platform) => summary.platformBreakdown[platform] > 0)
    .map((platform) => getPlatformName(platform))

  const platformCounts = Object.keys(summary.platformBreakdown)
    .filter((platform) => summary.platformBreakdown[platform] > 0)
    .map((platform) => summary.platformBreakdown[platform])

  const platformColors = Object.keys(summary.platformBreakdown)
    .filter((platform) => summary.platformBreakdown[platform] > 0)
    .map((platform) => getPlatformColor(platform))

  const platformDistributionData = {
    labels: platformLabels,
    datasets: [
      {
        data: platformCounts,
        backgroundColor: platformColors,
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="dashboard-card">
        <h3 className="text-xl font-semibold mb-4">
          <FaChartLine className="inline-block mr-2" /> Performance Overview
        </h3>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{summary.totalLikes}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaThumbsUp className="mr-1" /> Likes
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{summary.totalComments}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaComment className="mr-1" /> Comments
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{summary.totalShares}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaShare className="mr-1" /> Shares
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{summary.totalImpressions}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <FaEye className="mr-1" /> Impressions
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Platform Distribution</h4>
            <div className="h-64">
              <Pie
                data={platformDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Top Performing Posts</h4>
            {summary.topPerformingPosts.length > 0 ? (
              <div className="space-y-3">
                {summary.topPerformingPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm mb-1 truncate">{post.content}</div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <div className="flex space-x-2">
                        {post.platforms.map((platform) => (
                          <span key={platform} style={{ color: getPlatformColor(platform) }}>
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        <span className="flex items-center">
                          <FaThumbsUp className="mr-1" /> {post.likes}
                        </span>
                        <span className="flex items-center">
                          <FaComment className="mr-1" /> {post.comments}
                        </span>
                        <span className="flex items-center">
                          <FaShare className="mr-1" /> {post.shares}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500">No post data available yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3 className="text-xl font-semibold mb-4">Platform Analytics</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(summary.platformBreakdown)
            .filter((platform) => summary.platformBreakdown[platform] > 0)
            .map((platform) => (
              <button
                key={platform}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  selectedPlatform === platform
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handlePlatformSelect(platform)}
              >
                <span style={{ color: selectedPlatform === platform ? "white" : getPlatformColor(platform) }}>
                  {getPlatformIcon(platform)}
                </span>
                <span>{getPlatformName(platform)}</span>
              </button>
            ))}
        </div>

        {selectedPlatform && platformData[selectedPlatform] ? (
          <div className="h-80">
            {/* This would be customized based on the actual data structure returned by your API */}
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [
                  {
                    label: "Engagement",
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: getPlatformColor(selectedPlatform),
                    backgroundColor: `${getPlatformColor(selectedPlatform)}33`,
                    tension: 0.1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            {selectedPlatform ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-2"></div>
                Loading {getPlatformName(selectedPlatform)} data...
              </div>
            ) : (
              "Select a platform to view detailed analytics"
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsDashboard
