const express = require("express")
const router = express.Router()

// This is the verification token that Instagram will use to verify your webhook
// This should be stored in environment variables for security
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "mysecrettoken123"

/**
 * GET /webhook
 * Handles the webhook verification request from Instagram
 * This is required when you first set up the webhook in the Meta App Dashboard
 */
router.get("/webhook", (req, res) => {
  // Parse query parameters
  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  // Check if mode and token are in the query string
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("✅ WEBHOOK_VERIFIED")
      res.status(200).send(challenge)
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      console.log("❌ VERIFICATION_FAILED: Token mismatch")
      res.sendStatus(403)
    }
  } else {
    // Respond with '403 Forbidden' if required parameters are missing
    console.log("❌ VERIFICATION_FAILED: Missing parameters")
    res.sendStatus(403)
  }
})

/**
 * POST /webhook
 * Handles webhook events sent from Instagram
 * This will receive real-time updates when users interact with your Instagram app
 */
router.post("/webhook", (req, res) => {
  const body = req.body

  console.log("📩 WEBHOOK_EVENT_RECEIVED")
  console.log(JSON.stringify(body, null, 2))

  // Check if this is an event from a page subscription
  if (body.object === "instagram") {
    // Process the Instagram webhook event
    // Here you would add your business logic to handle different types of events
    console.log("✅ INSTAGRAM_EVENT_RECEIVED")

    // You can process different types of events here
    // For example:
    if (body.entry && body.entry.length > 0) {
      body.entry.forEach((entry) => {
        // Handle different types of Instagram webhook events
        if (entry.changes && entry.changes.length > 0) {
          entry.changes.forEach((change) => {
            console.log(`Change in field: ${change.field}`)
            // Process based on the field that changed
          })
        }
      })
    }
  } else {
    // Return a '404 Not Found' if event is not from Instagram
    console.log("❌ UNKNOWN_EVENT_TYPE")
  }

  // Always return a '200 OK' response to acknowledge receipt of the event
  res.status(200).send("EVENT_RECEIVED")
})

module.exports = router
