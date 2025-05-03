const cron = require("node-cron")
const axios = require("axios")
const crypto = require("crypto")
const User = require("../models/User")
const ScheduledPost = require("../models/ScheduledPost")

// Helper function to decrypt tokens
const decryptToken = (hash) => {
  const algorithm = "aes-256-ctr"
  const secretKey = crypto.createHash("sha256").update(process.env.JWT_SECRET).digest("base64").substr(0, 32)
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, "hex"))

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()])

  return decrpyted.toString()
}

// Function to publish a post to Instagram
const publishToInstagram = async (post, accessToken) => {
  try {
    // Note: This is a simplified example. In a real app, you would need to use the Instagram Graph API
    // to publish posts, which requires a business or creator account and app review by Facebook
    console.log(`[MOCK] Publishing to Instagram with token: ${accessToken.substring(0, 10)}...`)
    console.log(`[MOCK] Post content: ${post.content.text}`)

    // Mock successful response
    return {
      status: "success",
      postId: "instagram_" + Date.now(),
      publishedTime: new Date(),
    }
  } catch (error) {
    console.error("Error publishing to Instagram:", error)
    return {
      status: "failed",
      error: error.message,
    }
  }
}

// Main function to check and publish scheduled posts
const checkAndPublishPosts = async () => {
  try {
    console.log("Checking for posts to publish...")

    // Find posts that are scheduled and due to be published
    const now = new Date()
    const postsToPublish = await ScheduledPost.find({
      status: "scheduled",
      scheduledTime: { $lte: now },
    })

    console.log(`Found ${postsToPublish.length} posts to publish`)

    // Process each post
    for (const post of postsToPublish) {
      console.log(`Processing post ${post._id}`)

      // Find the user who owns this post
      const user = await User.findById(post.user)

      if (!user) {
        console.error(`User not found for post ${post._id}`)
        continue
      }

      const publishedPosts = []

      // Publish to each platform
      for (const platform of post.platforms) {
        console.log(`Publishing to ${platform}`)

        // Find the connected account for this platform
        const account = user.connectedAccounts.find((acc) => acc.platform === platform && acc.isActive)

        if (!account) {
          console.error(`No connected ${platform} account found for user ${user._id}`)
          publishedPosts.push({
            platform,
            status: "failed",
            error: `No connected ${platform} account found`,
          })
          continue
        }

        // Decrypt access token
        const accessToken = account.accessToken

        // Publish to the platform
        let result

        if (platform === "instagram") {
          result = await publishToInstagram(post, accessToken)
        } else {
          result = {
            status: "failed",
            error: `Unsupported platform: ${platform}`,
          }
        }

        publishedPosts.push({
          platform,
          ...result,
        })
      }

      // Update the post status
      post.status = "published"
      post.publishedPosts = publishedPosts

      // Initialize analytics
      post.analytics = {
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        lastUpdated: new Date(),
      }

      await post.save()

      console.log(`Post ${post._id} published to ${publishedPosts.length} platforms`)
    }
  } catch (error) {
    console.error("Error in post publishing job:", error)
  }
}

// Function to update analytics for published posts
const updatePostAnalytics = async () => {
  try {
    console.log("Updating post analytics...")

    // Find published posts that need analytics update
    const posts = await ScheduledPost.find({
      status: "published",
      // Only update posts that haven't been updated in the last hour
      "analytics.lastUpdated": { $lt: new Date(Date.now() - 60 * 60 * 1000) },
    })

    console.log(`Found ${posts.length} posts to update analytics`)

    // Process each post
    for (const post of posts) {
      console.log(`Updating analytics for post ${post._id}`)

      // Find the user who owns this post
      const user = await User.findById(post.user)

      if (!user) {
        console.error(`User not found for post ${post._id}`)
        continue
      }

      // Update analytics for each published post
      for (const publishedPost of post.publishedPosts) {
        if (publishedPost.status !== "success" || !publishedPost.postId) {
          continue
        }

        // Find the connected account for this platform
        const account = user.connectedAccounts.find((acc) => acc.platform === publishedPost.platform && acc.isActive)

        if (!account) {
          console.error(`No connected ${publishedPost.platform} account found for user ${user._id}`)
          continue
        }

        // Decrypt access token
        const accessToken = account.accessToken

        // Fetch analytics based on platform
        try {
          if (publishedPost.platform === "instagram") {
            // Note: This is a simplified example. In a real app, you would need to use the Instagram Graph API
            // to fetch actual insights data
            console.log(`[MOCK] Fetching Instagram analytics for post ${publishedPost.postId}`)

            // Mock analytics data
            post.analytics.likes = Math.floor(Math.random() * 100)
            post.analytics.comments = Math.floor(Math.random() * 20)
            post.analytics.shares = Math.floor(Math.random() * 10)
            post.analytics.impressions = Math.floor(Math.random() * 1000)
          }
        } catch (error) {
          console.error(`Error fetching analytics for ${publishedPost.platform} post:`, error)
        }
      }

      // Update the last updated timestamp
      post.analytics.lastUpdated = new Date()

      await post.save()

      console.log(`Analytics updated for post ${post._id}`)
    }
  } catch (error) {
    console.error("Error in analytics update job:", error)
  }
}

// Initialize cron jobs
const initScheduler = () => {
  // Check for posts to publish every minute
  cron.schedule("* * * * *", checkAndPublishPosts)

  // Update analytics every hour
  cron.schedule("0 * * * *", updatePostAnalytics)

  console.log("Post scheduler initialized")
}

module.exports = { initScheduler }
