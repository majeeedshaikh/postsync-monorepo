import { Link } from "react-router-dom"
import {
  FaRocket,
  FaChartLine,
  FaCalendarAlt,
  FaUsers,
  FaRobot,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa"

const Landing = () => {
  // Testimonials data
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Marketing Lead at Sproutly",
      quote: "PostSync saves us hours every week. The calendar view is a game-changer!",
      avatar: "S",
    },
    {
      name: "Jake R.",
      role: "Solo Entrepreneur",
      quote: "I can manage five social profiles in 15 minutes. Love the simplicity!",
      avatar: "J",
    },
    {
      name: "Amara D.",
      role: "Digital Creator",
      quote: "I finally stopped copy-pasting across apps. PostSync keeps me organized.",
      avatar: "A",
    },
  ]

  // Features data
  const features = [
    {
      icon: <FaRocket />,
      title: "Multi-Platform Publishing",
      description: "Schedule and publish content to Facebook, Instagram, Twitter, TikTok, LinkedIn, and more.",
    },
    {
      icon: <FaChartLine />,
      title: "Performance Analytics",
      description: "View key engagement metrics across all channels from a single dashboard.",
    },
    {
      icon: <FaUsers />,
      title: "Team Collaboration",
      description: "Invite team members, assign roles, approve content — all in one place.",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Content Calendar",
      description: "A sleek visual calendar to manage your entire social media strategy.",
    },
    {
      icon: <FaRobot />,
      title: "AI Content Suggestions",
      description: "Coming soon: Let AI help you brainstorm fresh post ideas.",
    },
  ]

  return (
    <div className="landing-page">
      {/* Sticky Navbar */}
      <nav className="sticky-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-logo">
              <FaRocket /> PostSync
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#testimonials">Reviews</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="nav-buttons">
              <Link to="/login" className="btn btn-outline">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Take control of your brand's online presence</h1>
              <p>
                PostSync helps you plan, schedule, publish, and analyze content across all your social platforms — from
                one simple dashboard.
              </p>
              <Link to="/signup" className="btn btn-primary btn-large">
                Get Started for Free
              </Link>
            </div>
            <div className="hero-image">
              <img src="/placeholder.svg?height=400&width=500" alt="PostSync Dashboard" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to succeed on social media</h2>
            <p>Powerful tools to simplify your social media workflow</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Loved by social media managers</h2>
            <p>See what our users have to say about PostSync</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-content">
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{testimonial.avatar}</div>
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Icons Section */}
      <section className="social-platforms-section">
        <div className="container">
          <div className="section-header">
            <h2>Connect all your favorite platforms</h2>
            <p>PostSync works seamlessly with all major social networks</p>
          </div>
          <div className="social-icons">
            <div className="social-icon facebook">
              <FaFacebook />
            </div>
            <div className="social-icon instagram">
              <FaInstagram />
            </div>
            <div className="social-icon linkedin">
              <FaLinkedin />
            </div>
            <div className="social-icon tiktok">
              <FaTiktok />
            </div>
            <div className="social-icon pinterest">
              <FaPinterest />
            </div>
            <div className="social-icon twitter">
              <FaTwitter />
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Callout Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to elevate your brand?</h2>
            <p>Start your free plan today and simplify your entire content workflow.</p>
            <Link to="/signup" className="btn btn-primary btn-large">
              Create Your Account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <FaRocket /> PostSync
            </div>
            <div className="footer-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-and-conditions">Terms of Service</a>
            </div>
            <div className="footer-social">
              <a href="#facebook" className="social-icon-small">
                <FaFacebook />
              </a>
              <a href="#instagram" className="social-icon-small">
                <FaInstagram />
              </a>
              <a href="#linkedin" className="social-icon-small">
                <FaLinkedin />
              </a>
              <a href="#twitter" className="social-icon-small">
                <FaTwitter />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>PostSync © 2025</p>
            <p>Built with ❤️ by Abdul Wasay, Abdul Majeed, Affan Khan - FAST NUCES</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
