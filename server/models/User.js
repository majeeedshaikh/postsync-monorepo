const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Connected account schema
const connectedAccountSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ["facebook", "twitter", "linkedin", "instagram", "pinterest", "tiktok"],
  },
  accountId: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accessToken: {
    type: Object, // Store encrypted token object with iv and content
    required: true,
  },
  refreshToken: {
    type: Object, // Store encrypted token object with iv and content
  },
  tokenExpiry: {
    type: Date,
  },
  profilePicture: {
    type: String,
  },
  username: {
    type: String,
  },
  // New fields for Instagram Business Account
  pageId: {
    type: String,
  },
  igBusinessAccountId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
})

// User schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  connectedAccounts: [connectedAccountSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
