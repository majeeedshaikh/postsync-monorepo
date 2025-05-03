const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")
const cookieParser = require("cookie-parser")
//const authRoutes = require("./routes/authRoutes")
//const postRoutes = require("./routes/postRoutes")
const webhookRoutes = require("./routes/webhookRoutes")
const instagramRoutes = require("./routes/instagramRoutes")
const { initScheduler } = require("./services/scheduler")
const authenticateToken = require("./middleware/auth")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 49152

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3002",
    credentials: true,
  }),
)
app.use(cookieParser())

// Parse JSON requests
// IMPORTANT: For Meta webhooks, we need raw body for signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString()
    },
  }),
)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes


app.use("/api/instagram", instagramRoutes)



const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


// Webhook routes - these are at the root level, not under /api
app.use("/", webhookRoutes)

// Get user data (protected route)
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await mongoose.model("User").findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Filter out sensitive information from connected accounts
    const sanitizedUser = {
      ...user.toObject(),
      connectedAccounts: user.connectedAccounts
        ? user.connectedAccounts.map((account) => ({
            ...account,
            accessToken: undefined,
            refreshToken: undefined,
          }))
        : [],
    }

    res.json(sanitizedUser)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Initialize the post scheduler
initScheduler()
//const path = require('path');
// serve React static assets
//app.use(express.static(path.join(__dirname, 'public')));
// any other route not handled—serve index.html
//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//s});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`)
  console.log(`For Instagram to access your webhook, use a service like ngrok to expose this URL`)
})
