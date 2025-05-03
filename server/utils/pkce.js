// server/utils/pkce.js
import crypto from 'crypto'

// base64-URL encode
function base64URLEncode(str) {
  return str
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// SHA256 buffer → buffer
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest()
}

export function generatePKCEPair() {
  const verifier = base64URLEncode(crypto.randomBytes(32))
  const challenge = base64URLEncode(sha256(verifier))
  return { verifier, challenge }
}
