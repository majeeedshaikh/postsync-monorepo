const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const authenticateToken = require("../middleware/auth")
const instagramService = require("../services/instagramService")

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

// Check Instagram connection status
router.get("/connection-status", authenticateToken, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const igAccount = user.connectedAccounts.find(a => a.platform === 'instagram' && a.isActive === true);
    
    return res.json({
      connected: !!igAccount,
      username: igAccount?.username || null,
      accountName: igAccount?.accountName || null,
      profilePicture: igAccount?.profilePicture || null,
      connectedAt: igAccount?.connectedAt || null,
      // Add these fields to help troubleshoot connection issues
      hasAccessToken: !!igAccount?.accessToken,
      hasPageId: !!igAccount?.pageId,
      hasIgBusinessId: !!igAccount?.igBusinessAccountId
    });
  } catch (error) {
    console.error("Error checking Instagram connection:", error);
    res.status(500).json({ message: error.message || "Failed to check Instagram connection" });
  }
});

// Get Instagram profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching Instagram profile for user:", req.user.id);
    
    // First check if the user has an active Instagram connection
    const user = await require("../models/User").findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const igAccount = user.connectedAccounts.find(a => a.platform === 'instagram' && a.isActive === true);
    if (!igAccount) {
      return res.status(400).json({ 
        message: "No active Instagram account found",
        code: "NO_INSTAGRAM_ACCOUNT"
      });
    }
    
    const profile = await instagramService.getInstagramProfile(req.user.id);
    console.log("Profile fetched successfully");
    res.json(profile);
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    res.status(error.response?.status || 500).json({ 
      message: error.message || "Failed to fetch Instagram profile",
      details: error.response?.data || null,
      code: error.message.includes("No active Instagram account") ? "NO_INSTAGRAM_ACCOUNT" : "API_ERROR"
    });
  }
});

// Get Instagram media (posts)
router.get("/media", authenticateToken, async (req, res) => {
  try {
    const limit = req.query.limit ? Number.parseInt(req.query.limit) : 10;
    console.log(`Fetching Instagram media (limit: ${limit}) for user:`, req.user.id);
    
    // Check connection first
    const user = await require("../models/User").findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const igAccount = user.connectedAccounts.find(a => a.platform === 'instagram' && a.isActive === true);
    if (!igAccount) {
      return res.status(400).json({ 
        message: "No active Instagram account found",
        code: "NO_INSTAGRAM_ACCOUNT"
      });
    }
    
    const media = await instagramService.getInstagramMedia(req.user.id, limit);
    res.json(media);
  } catch (error) {
    console.error("Error fetching Instagram media:", error);
    res.status(error.response?.status || 500).json({ 
      message: error.message || "Failed to fetch Instagram media",
      details: error.response?.data || null,
      code: error.message.includes("No active Instagram account") ? "NO_INSTAGRAM_ACCOUNT" : "API_ERROR"
    });
  }
});

// Get Instagram insights
router.get("/insights", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching Instagram insights for user:", req.user.id);
    
    // Check connection first
    const user = await require("../models/User").findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const igAccount = user.connectedAccounts.find(a => a.platform === 'instagram' && a.isActive === true);
    if (!igAccount) {
      return res.status(400).json({ 
        message: "No active Instagram account found",
        code: "NO_INSTAGRAM_ACCOUNT"
      });
    }
    
    const insights = await instagramService.getInstagramInsights(req.user.id);
    res.json(insights);
  } catch (error) {
    console.error("Error fetching Instagram insights:", error);
    res.status(error.response?.status || 500).json({ 
      message: error.message || "Failed to fetch Instagram insights",
      details: error.response?.data || null,
      code: error.message.includes("No active Instagram account") ? "NO_INSTAGRAM_ACCOUNT" : "API_ERROR"
    });
  }
});

// Post to Instagram
router.post("/post", authenticateToken, upload.single("media"), async (req, res) => {
  try {
    // Check connection first before processing upload
    const user = await require("../models/User").findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const igAccount = user.connectedAccounts.find(a => a.platform === 'instagram' && a.isActive === true);
    if (!igAccount) {
      return res.status(400).json({ 
        message: "No active Instagram account found. Please connect your Instagram account first.",
        code: "NO_INSTAGRAM_ACCOUNT"
      });
    }
    
    const { caption } = req.body;

    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Media file is required for Instagram posts" });
    }

    console.log("Uploading media for Instagram post:", {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Get the file path and server URL
    const filePath = req.file.path;
    
    // Make sure the path is absolute
    const absoluteFilePath = path.resolve(filePath);
    
    // Make sure the media URL is accessible
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const mediaUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log(`Media URL for upload: ${mediaUrl}`);

    // Determine media type
    const mediaType = req.file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO";

    // Post to Instagram
    const result = await instagramService.postToInstagram(req.user.id, {
      caption,
      mediaUrl,
      mediaType,
    });

    res.json(result);
  } catch (error) {
    console.error("Error posting to Instagram:", error);
    res.status(error.response?.status || 500).json({ 
      message: error.message || "Failed to post to Instagram",
      details: error.response?.data || null,
      code: error.message.includes("No active Instagram account") ? "NO_INSTAGRAM_ACCOUNT" : "API_ERROR"
    });
  }
});
    
// Upload media for Instagram
router.post("/upload-media", authenticateToken, upload.single("media"), async (req, res) => {
  try {
    // Check connection first
    const user = await require("../models/User").findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const igAccount = user.connectedAccounts.find(a => a.platform === 'instagram' && a.isActive === true);
    if (!igAccount) {
      return res.status(400).json({ 
        message: "No active Instagram account found",
        code: "NO_INSTAGRAM_ACCOUNT"
      });
    }
    
    const { caption } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" })
    }

    // Upload media to Facebook for Instagram
    const result = await instagramService.uploadMediaForInstagram(req.user.id, req.file.path, caption || "")

    res.json(result)
  } catch (error) {
    console.error("Error uploading media for Instagram:", error)
    res.status(500).json({ 
      message: error.message || "Failed to upload media",
      code: error.message.includes("No active Instagram account") ? "NO_INSTAGRAM_ACCOUNT" : "API_ERROR"
    })
  }
})

module.exports = router