const mongoose = require("mongoose")

const scheduledPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platforms: [
    {
      type: String,
      required: true,
      enum: ["facebook", "twitter", "linkedin", "instagram", "pinterest", "tiktok"],
    },
  ],
  content: {
    text: {
      type: String,
      required: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
        },
        url: String,
      },
    ],
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "published", "failed"],
    default: "scheduled",
  },
  publishedPosts: [
    {
      platform: {
        type: String,
        required: true,
      },
      postId: {
        type: String,
      },
      publishedTime: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["success", "failed"],
      },
      error: {
        type: String,
      },
    },
  ],
  analytics: {
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("ScheduledPost", scheduledPostSchema)
