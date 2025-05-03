// server/routes/authRoutes.js
require('dotenv').config();
const express  = require('express');
const axios    = require('axios');
const { v4: uuidv4 } = require('uuid');
const { OAuth } = require('oauth');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const authenticateToken = require('../middleware/auth');
const authenticate   = require('../middleware/auth')


const oauthStateStore = new Map();

const router = express.Router()

// In-memory store for state+nonce
const oauthStore = new Map()










// ─── ENV ─────────────────────────────────────────────────────────────────────
const {
  JWT_SECRET                 = 'postsyncsupersecretkey123',
  BASE_URL,                   // e.g. https://xxxxx.ngrok.io or your Railway URL
  FRONTEND_URL               = 'http://localhost:3002',

  // Facebook / Instagram Business
  FB_APP_ID,
  FB_APP_SECRET,

  // LinkedIn
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI,      // e.g. `${BASE_URL}/api/auth/linkedin/callback`

  // Twitter OAuth 1.0a
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY,
  TWITTER_CALLBACK_URL        // e.g. `${BASE_URL}/api/auth/twitter/callback`
} = process.env;

// ─── SIGNUP / LOGIN ────────────────────────────────────────────────────────────
// Register
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await new User({ fullName, email, password }).save();
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, user: { id: user._id, fullName, email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── INSTAGRAM (via Facebook) OAUTH FLOW ───────────────────────────────────────
// 1) start
router.get('/instagram', authenticateToken, (req, res) => {
  const state = uuidv4();
  oauthStateStore.set(state, { userId: req.user.id, expires: Date.now() + 10*60*1000 });

  const redirectUri = `${BASE_URL}/api/auth/instagram/callback`;
  const scopes = [
    'pages_read_engagement',
    'pages_manage_posts',
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_insights'
  ].join(',');

  const authUrl =
    `https://www.facebook.com/v18.0/dialog/oauth` +
    `?client_id=${FB_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&response_type=code`;

  res.redirect(authUrl);
});

// 2) callback
router.get('/instagram/callback', async (req, res) => {
  const { code, state } = req.query;
  const stored = oauthStateStore.get(state);
  oauthStateStore.delete(state);
  if (!code || !stored || stored.expires < Date.now()) {
    return res.redirect(`${FRONTEND_URL}/dashboard?error=instagram_auth_failed`);
  }

  try {
    // exchange code → short-lived token
    const redirectUri = `${BASE_URL}/api/auth/instagram/callback`;
    const shortRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: { client_id: FB_APP_ID, client_secret: FB_APP_SECRET, redirect_uri: redirectUri, code }
    });
    const shortToken = shortRes.data.access_token;

    // short → long-lived
    const longRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        fb_exchange_token: shortToken
      }
    });
    const userLongToken = longRes.data.access_token;

    // list pages
    const pagesRes = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: { access_token: userLongToken }
    });
    const pages = pagesRes.data.data || [];

    // find IG Business
    let igBusinessAccountId, pageToken, pageId, pageName;
    for (const page of pages) {
      const pg = await axios.get(`https://graph.facebook.com/v18.0/${page.id}`, {
        params: { fields: 'instagram_business_account', access_token: page.access_token }
      });
      if (pg.data.instagram_business_account) {
        igBusinessAccountId = pg.data.instagram_business_account.id;
        pageToken = page.access_token;
        pageId = page.id;
        pageName = page.name;
        break;
      }
    }
    if (!igBusinessAccountId) throw new Error('No IG Business account found');

    // fetch IG profile
    const igRes = await axios.get(`https://graph.facebook.com/v18.0/${igBusinessAccountId}`, {
      params: { fields: 'username,name,profile_picture_url', access_token: pageToken }
    });
    const { username, name: igName, profile_picture_url } = igRes.data;

    // save to user.connectedAccounts
    const user = await User.findById(stored.userId);
    const newAcct = {
      platform: 'instagram',
      accountId: igBusinessAccountId,
      accessToken: pageToken,
      pageId,
      igBusinessAccountId,
      accountName: igName || pageName,
      username,
      profilePicture: profile_picture_url,
      connectedAt: new Date()
    };
    const idx = user.connectedAccounts.findIndex(a =>
      a.platform==='instagram' && a.igBusinessAccountId===igBusinessAccountId
    );
    if (idx>=0) user.connectedAccounts[idx]=newAcct;
    else         user.connectedAccounts.push(newAcct);
    await user.save();

    return res.redirect(
      `${FRONTEND_URL}/dashboard?accountConnected=instagram&username=${encodeURIComponent(username)}`
    );
  } catch (err) {
    console.error('Instagram OAuth error:', err.response?.data||err.message);
    return res.redirect(
      `${FRONTEND_URL}/dashboard?error=instagram_auth_failed&message=${encodeURIComponent(err.message)}`
    );
  }
});

// 3) status
router.get('/instagram/status', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const connected = user.connectedAccounts.some(a => a.platform==='instagram');
  res.json({ connected });
});

// 1) START OIDC-HYBRID
router.get('/linkedin', authenticate, (req, res) => {
  const state = uuidv4()
  const nonce = uuidv4()

  // store both for 10 minutes
  oauthStore.set(state, {
    userId: req.user.id,
    nonce,
    expires: Date.now() + 10*60*1000
  })

  const params = new URLSearchParams({
    response_type: 'code id_token',      // ask for code + id_token
    client_id:     LINKEDIN_CLIENT_ID,
    redirect_uri:  LINKEDIN_REDIRECT_URI,
    scope:         'openid profile email w_member_social',
    state,
    nonce
  })

  // 🔥 MUST be https://www.linkedin.com
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`)
})

// 2) CALLBACK
router.get('/linkedin/callback', async (req, res) => {
  const { code, id_token, state } = req.query
  const session = oauthStore.get(state)
  oauthStore.delete(state)

  // validate state + expiration
  if (!code || !id_token || !session || session.expires < Date.now()) {
    return res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin_state_invalid`)
  }

  try {
    // 2.a) Exchange code → access_token
    const tokenRes = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        redirect_uri:  LINKEDIN_REDIRECT_URI,
        client_id:     LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const { access_token, expires_in } = tokenRes.data

    // 2.b) Decode & verify the id_token
    const payload = jwt.verify(id_token, LINKEDIN_CLIENT_SECRET, { algorithms: ['HS256'] })

    // ensure nonce matches
    if (payload.nonce !== session.nonce) {
      console.error('LinkedIn nonce mismatch')
      return res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin_nonce_mismatch`)
    }

    const linkedinId = payload.sub
    const fullName   = `${payload.given_name||''} ${payload.family_name||''}`.trim()
    const email      = payload.email

    // 2.c) Persist to user.connectedAccounts
    const user = await User.findById(session.userId)
    const newAcct = {
      platform:     'linkedin',
      accountId:    linkedinId,
      accountName:  fullName,
      username:     fullName,
      email,
      accessToken:  access_token,
      tokenExpires: Date.now() + expires_in*1000,
      connectedAt:  new Date()
    }

    const idx = user.connectedAccounts.findIndex(a => a.platform === 'linkedin')
    if (idx >= 0) user.connectedAccounts[idx] = newAcct
    else          user.connectedAccounts.push(newAcct)
    await user.save()

    // 2.d) Success → back to your React UI
    return res.redirect(
      `${FRONTEND_URL}/dashboard?accountConnected=linkedin&username=${encodeURIComponent(fullName)}`
    )
  } catch (err) {
    console.error('LinkedIn OAuth error:', err.response?.data || err.message)
    return res.redirect(
      `${FRONTEND_URL}/dashboard?error=linkedin_oauth_failed&message=${encodeURIComponent(err.message)}`
    )
  }
})

// 3) STATUS & LIST ALL ACCOUNTS
router.get('/linkedin/status', authenticateToken, async (req, res) => {
  const u = await User.findById(req.user.id)
  const ok = u.connectedAccounts.some(a=>a.platform==='linkedin')
  res.json({ connected: ok })
})

router.get('/accounts', authenticateToken, async (req, res) => {
  const u = await User.findById(req.user.id)
  res.json(u.connectedAccounts || [])
})

module.exports = router
// 5) LIST ALL CONNECTED ACCOUNTS
router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    // assuming `user.connectedAccounts` is an array of { platform, accountId, accountName, username, … }
    res.json(user.connectedAccounts || [])
  } catch (err) {
    console.error('Error fetching accounts:', err)
    res.status(500).json({ message: 'Server error' })
  }
})


// ─── FACEBOOK (USER FEED) OAUTH FLOW ────────────────────────────────────────────
// start
router.get('/facebook', authenticateToken, (req, res) => {
  const state = uuidv4();
  oauthStateStore.set(state, { userId: req.user.id, expires: Date.now()+10*60*1000 });
  const redirectUri = `${BASE_URL}/api/auth/facebook/callback`;
  const scopes = ['public_profile','email','pages_manage_posts','publish_to_groups','publish_pages'].join(',');
  const authUrl =
    `https://www.facebook.com/v18.0/dialog/oauth` +
    `?client_id=${FB_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&response_type=code`;
  res.redirect(authUrl);
});

// callback
router.get('/facebook/callback', authenticateToken, async (req, res) => {
  const { code, state } = req.query;
  const stored = oauthStateStore.get(state);
  oauthStateStore.delete(state);
  if (!code||!stored||stored.expires<Date.now()) {
    return res.redirect(`${FRONTEND_URL}/dashboard?error=facebook_auth_failed`);
  }

  try {
    const redirectUri = `${BASE_URL}/api/auth/facebook/callback`;
    const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params:{
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        redirect_uri: redirectUri,
        code
      }
    });
    const userToken = tokenRes.data.access_token;

    // get user profile
    const meRes = await axios.get('https://graph.facebook.com/v18.0/me', {
      params:{ fields:'id,name', access_token: userToken }
    });
    const { id, name } = meRes.data;

    // save
    const user = await User.findById(stored.userId);
    const newAcct = {
      platform: 'facebook',
      accountId: id,
      accessToken: userToken,
      accountName: name,
      username: name,
      connectedAt: new Date()
    };
    const idx = user.connectedAccounts.findIndex(a=>a.platform==='facebook');
    if(idx>=0) user.connectedAccounts[idx]=newAcct;
    else       user.connectedAccounts.push(newAcct);
    await user.save();

    return res.redirect(
      `${FRONTEND_URL}/dashboard?accountConnected=facebook&username=${encodeURIComponent(name)}`
    );
  } catch (err) {
    console.error('Facebook OAuth error:', err.response?.data||err.message);
    return res.redirect(
      `${FRONTEND_URL}/dashboard?error=facebook_auth_failed&message=${encodeURIComponent(err.message)}`
    );
  }
});

// status
router.get('/facebook/status', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const connected = user.connectedAccounts.some(a=>a.platform==='facebook');
  res.json({ connected });
});

// ─── TWITTER (OAUTH 1.0a) FLOW ─────────────────────────────────────────────────
// init OAuth client
const twitterOauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  TWITTER_API_KEY,
  TWITTER_API_SECRET_KEY,
  '1.0A',
  TWITTER_CALLBACK_URL,
  'HMAC-SHA1'
);

// start
router.get('/twitter', authenticateToken, (req, res) => {
  twitterOauth.getOAuthRequestToken((err, oauthToken, oauthTokenSecret) => {
    if (err) return res.redirect(`${FRONTEND_URL}/dashboard?error=twitter_auth_failed`);
    oauthStateStore.set(oauthToken, {
      userId: req.user.id,
      oauthTokenSecret,
      expires: Date.now()+10*60*1000
    });
    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`);
  });
});

// callback
router.get('/twitter/callback', authenticateToken, (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  const stored = oauthStateStore.get(oauth_token);
  oauthStateStore.delete(oauth_token);
  if (!stored || stored.expires < Date.now()) {
    return res.redirect(`${FRONTEND_URL}/dashboard?error=twitter_auth_failed`);
  }

  twitterOauth.getOAuthAccessToken(
    oauth_token, stored.oauthTokenSecret, oauth_verifier,
    async (err, oauthAccessToken, oauthAccessTokenSecret, results) => {
      if (err) {
        console.error('Twitter OAuth error:', err);
        return res.redirect(`${FRONTEND_URL}/dashboard?error=twitter_auth_failed`);
      }

      const { user_id, screen_name } = results;
      // save
      const user = await User.findById(stored.userId);
      const newAcct = {
        platform: 'twitter',
        accountId: user_id,
        accessToken: oauthAccessToken,
        accessTokenSecret: oauthAccessTokenSecret,
        accountName: screen_name,
        username: screen_name,
        connectedAt: new Date()
      };
      const idx = user.connectedAccounts.findIndex(a=>a.platform==='twitter');
      if(idx>=0) user.connectedAccounts[idx]=newAcct;
      else       user.connectedAccounts.push(newAcct);
      await user.save();

      return res.redirect(
        `${FRONTEND_URL}/dashboard?accountConnected=twitter&username=${encodeURIComponent(screen_name)}`
      );
    }
  );
});

// status
router.get('/twitter/status', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const connected = user.connectedAccounts.some(a=>a.platform==='twitter');
  res.json({ connected });
});

// ─── DISCONNECT ────────────────────────────────────────────────────────────────
router.delete('/disconnect/:platform/:accountId', authenticateToken, async (req, res) => {
  const { platform, accountId } = req.params;
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { connectedAccounts: { platform, accountId } }
  });
  res.json({ success: true });
});

module.exports = router;
