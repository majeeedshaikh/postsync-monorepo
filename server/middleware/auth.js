// server/middleware/auth.js
const jwt = require('jsonwebtoken')

module.exports = function authenticateToken(req, res, next) {
  let token
  // 1) header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  // 2) query-string
  else if (req.query.token) {
    token = req.query.token
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, email: payload.email }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token.' })
  }
}
