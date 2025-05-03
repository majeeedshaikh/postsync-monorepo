const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")
const axios = require("axios")
const User = require("../models/User")
const ScheduledPost = require("../models/ScheduledPost")
const authenticateToken = require("../middleware/auth")

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (ext && mimetype) {
      return cb(null, true)
    }

    cb(new Error("Only images and videos are allowed"))
  },
})

// Helper function to decrypt tokens
const decryptToken = (hash) => {
  const algorithm = "aes-256-ctr"
  const secretKey = crypto.createHash("sha256").update(process.env.JWT_SECRET).digest("base64").substr(0, 32)
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, "hex"))

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()])

  return decrpyted.toString()
}

// Get all connected accounts for the user
router.get("/accounts", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Filter out sensitive information
    const accounts = user.connectedAccounts.map((account) => ({
      id: account._id,
      platform: account.platform,
      accountId: account.accountId,
      accountName: account.accountName,
      username: account.username,
      profilePicture: account.profilePicture,
      isActive: account.isActive,
      connectedAt: account.connectedAt,
    }))

    res.json(accounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Schedule a post
router.post("/schedule", authenticateToken, upload.array("media", 5), async (req, res) => {
  try {
    const { text, platforms, scheduledTime } = req.body

    if (!text || !platforms || !scheduledTime) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Parse platforms if it's a string
    const parsedPlatforms = typeof platforms === "string" ? JSON.parse(platforms) : platforms

    // Validate platforms
    if (!Array.isArray(parsedPlatforms) || parsedPlatforms.length === 0) {
      return res.status(400).json({ message: "At least one platform must be selected" })
    }

    // Process uploaded media files
    const media = req.files
      ? req.files.map((file) => ({
          type: file.mimetype.startsWith("image/") ? "image" : "video",
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        }))
      : []

    // Create new scheduled post
    const scheduledPost = new ScheduledPost({
      user: req.user.id,
      platforms: parsedPlatforms,
      content: {
        text,
        media,
      },
      scheduledTime: new Date(scheduledTime),
      status: "scheduled",
    })

    await scheduledPost.save()

    res.status(201).json(scheduledPost)
  } catch (error) {
    console.error("Error scheduling post:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all scheduled posts for the user
router.get("/scheduled", authenticateToken, async (req, res) => {
  try {
    const posts = await ScheduledPost.find({
      user: req.user.id,
      status: "scheduled",
    }).sort({ scheduledTime: 1 })

    res.json(posts)
  } catch (error) {
    console.error("Error fetching scheduled posts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all posts (scheduled, published, failed)
router.get("/posts", authenticateToken, async (req, res) => {
  try {
    const { status, platform, startDate, endDate } = req.query

    // Build query
    const query = { user: req.user.id }

    if (status) {
      query.status = status
    }

    if (platform) {
      query.platforms = platform
    }

    if (startDate || endDate) {
      query.scheduledTime = {}

      if (startDate) {
        query.scheduledTime.$gte = new Date(startDate)
      }

      if (endDate) {
        query.scheduledTime.$lte = new Date(endDate)
      }
    }

    const posts = await ScheduledPost.find(query).sort({ scheduledTime: -1 })

    res.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single post by ID
router.get("/posts/:id", authenticateToken, async (req, res) => {
  try {
    const post = await ScheduledPost.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a scheduled post
router.put("/posts/:id", authenticateToken, upload.array("media", 5), async (req, res) => {
  try {
    const { text, platforms, scheduledTime } = req.body

    // Find the post
    const post = await ScheduledPost.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "scheduled", // Only allow editing scheduled posts
    })

    if (!post) {
      return res.status(404).json({ message: "Post not found or cannot be edited" })
    }

    // Update fields if provided
    if (text) {
      post.content.text = text
    }

    if (platforms) {
      // Parse platforms if it's a string
      const parsedPlatforms = typeof platforms === "string" ? JSON.parse(platforms) : platforms
      post.platforms = parsedPlatforms
    }

    if (scheduledTime) {
      post.scheduledTime = new Date(scheduledTime)
    }

    // Process new media files if uploaded
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map((file) => ({
        type: file.mimetype.startsWith("image/") ? "image" : "video",
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      }))

      // Replace or append media based on request
      if (req.body.replaceMedia === "true") {
        post.content.media = newMedia
      } else {
        post.content.media = [...post.content.media, ...newMedia]
      }
    }

    await post.save()

    res.json(post)
  } catch (error) {
    console.error("Error updating post:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a scheduled post
router.delete("/posts/:id", authenticateToken, async (req, res) => {
  try {
    const result = await ScheduledPost.deleteOne({
      _id: req.params.id,
      user: req.user.id,
      status: "scheduled", // Only allow deleting scheduled posts
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found or cannot be deleted" })
    }

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get analytics for Instagram
router.get("/analytics/instagram", authenticateToken, async (req, res) => {
  try {
    // Find user to get access token
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Find connected account for Instagram
    const account = user.connectedAccounts.find((acc) => acc.platform === "instagram" && acc.isActive)

    if (!account) {
      return res.status(404).json({ message: "No connected Instagram account found" })
    }

    // Decrypt access token
    const accessToken = account.accessToken

    // Fetch Instagram insights
    // Note: This is a simplified example. In a real app, you would need to use the Instagram Graph API
    // to fetch actual insights data
    const analyticsData = {
      followers: 1250,
      engagement_rate: 3.2,
      reach: 49152,
      impressions: 7500,
      top_posts: [
        {
          id: "post1",
          likes: 120,
          comments: 15,
          reach: 1200,
        },
        {
          id: "post2",
          likes: 95,
          comments: 8,
          reach: 950,
        },
      ],
    }

    res.json(analyticsData)
  } catch (error) {
    console.error("Error fetching Instagram analytics:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get summary analytics across all platforms
router.get("/analytics/summary", authenticateToken, async (req, res) => {
  try {
    // Get published posts with analytics
    const posts = await ScheduledPost.find({
      user: req.user.id,
      status: "published",
    })

    // Calculate summary metrics
    const summary = {
      totalPosts: posts.length,
      totalLikes: posts.reduce((sum, post) => sum + (post.analytics?.likes || 0), 0),
      totalComments: posts.reduce((sum, post) => sum + (post.analytics?.comments || 0), 0),
      totalShares: posts.reduce((sum, post) => sum + (post.analytics?.shares || 0), 0),
      totalImpressions: posts.reduce((sum, post) => sum + (post.analytics?.impressions || 0), 0),
      platformBreakdown: {
        instagram: posts.filter((post) => post.platforms.includes("instagram")).length,
      },
      topPerformingPosts: posts
        .sort((a, b) => {
          const engagementA = (a.analytics?.likes || 0) + (a.analytics?.comments || 0) + (a.analytics?.shares || 0)
          const engagementB = (b.analytics?.likes || 0) + (b.analytics?.comments || 0) + (b.analytics?.shares || 0)
          return engagementB - engagementA
        })
        .slice(0, 5)
        .map((post) => ({
          id: post._id,
          content: post.content.text.substring(0, 100) + (post.content.text.length > 100 ? "..." : ""),
          platforms: post.platforms,
          publishedAt: post.publishedPosts[0]?.publishedTime,
          likes: post.analytics?.likes || 0,
          comments: post.analytics?.comments || 0,
          shares: post.analytics?.shares || 0,
        })),
    }

    res.json(summary)
  } catch (error) {
    console.error("Error fetching analytics summary:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
