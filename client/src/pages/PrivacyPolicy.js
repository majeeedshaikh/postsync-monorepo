import { Link } from "react-router-dom"
import { FaRocket, FaArrowLeft } from "react-icons/fa"

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header with back button */}
      <header className="sticky-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-logo">
              <Link to="/">
                <FaRocket /> PostSync
              </Link>
            </div>
            <div className="nav-buttons">
              <Link to="/" className="btn btn-outline">
                <FaArrowLeft className="mr-2" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to PostSync ("we," "our," or "us"). We respect your privacy and are committed to protecting your
            personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our social media management application.
          </p>
          <p className="mb-4">
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
            do not access the application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-medium mb-3">1.1 Information from Instagram and Facebook</h3>
          <p className="mb-4">
            When you connect your Instagram Business account through Facebook Login, we collect the following
            information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Instagram Business Account ID</li>
            <li>Instagram username</li>
            <li>Profile name</li>
            <li>Profile picture URL</li>
            <li>Page access tokens</li>
            <li>Media content (posts, captions, images, videos)</li>
            <li>Insights and analytics data (followers count, engagement metrics, impressions, reach)</li>
            <li>Comments and interactions on your posts</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">1.2 Information You Provide</h3>
          <p className="mb-4">We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information (name, email address, password)</li>
            <li>Profile information</li>
            <li>Content you create, upload, or share through our application</li>
            <li>Communications with us</li>
            <li>Survey responses</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">1.3 Automatically Collected Information</h3>
          <p className="mb-4">When you access our application, we automatically collect:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (interactions with the application, features used)</li>
            <li>Log data</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Collect Your Information</h2>
          <p className="mb-4">We collect information through:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Facebook Login and Instagram Graph API:</strong> When you connect your Instagram Business account,
              we use Facebook Login and the Instagram Graph API to access your Instagram data with your permission.
            </li>
            <li>
              <strong>Direct Interactions:</strong> Information you provide when creating an account, using our
              features, or contacting us.
            </li>
            <li>
              <strong>Automated Technologies:</strong> Cookies, server logs, and similar technologies that automatically
              collect certain information.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Provide Our Services:</strong> To display your Instagram content, analytics, and insights within
              our application.
            </li>
            <li>
              <strong>Post Scheduling:</strong> To schedule and publish content to your Instagram account on your
              behalf.
            </li>
            <li>
              <strong>Analytics and Insights:</strong> To provide you with analytics and insights about your Instagram
              account performance.
            </li>
            <li>
              <strong>Improve Our Services:</strong> To understand how users interact with our application and improve
              functionality.
            </li>
            <li>
              <strong>Communication:</strong> To respond to your inquiries and provide support.
            </li>
            <li>
              <strong>Security:</strong> To detect, prevent, and address technical issues and security threats.
            </li>
            <li>
              <strong>Legal Compliance:</strong> To comply with applicable laws and regulations.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Encryption of sensitive data, including access tokens</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication procedures</li>
            <li>Secure data storage practices</li>
          </ul>
          <p className="mb-4">
            While we strive to use commercially acceptable means to protect your personal information, we cannot
            guarantee its absolute security. No method of transmission over the Internet or electronic storage is 100%
            secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Service Providers:</strong> We may share your information with third-party vendors, service
              providers, and contractors who perform services on our behalf and require access to such information to
              perform these services.
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
              portion of our assets, your information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
              response to valid requests by public authorities.
            </li>
            <li>
              <strong>Protection of Rights:</strong> We may disclose your information to protect and defend our rights
              or property, or the safety of our users or others.
            </li>
          </ul>
          <p className="mb-4">
            <strong>Note:</strong> We do not share your Instagram data with third parties for advertising purposes
            without your explicit consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this
            Privacy Policy, unless a longer retention period is required or permitted by law. When determining the
            retention period, we consider:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The amount, nature, and sensitivity of the personal information</li>
            <li>The potential risk of harm from unauthorized use or disclosure</li>
            <li>The purposes for which we process the data</li>
            <li>Whether we can achieve those purposes through other means</li>
            <li>Legal, regulatory, and contractual requirements</li>
          </ul>
          <p className="mb-4">
            When you disconnect your Instagram account from our application or delete your account, we will delete or
            anonymize your Instagram data within 30 days, unless we are legally required to retain it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Access:</strong> You can request copies of your personal information.
            </li>
            <li>
              <strong>Rectification:</strong> You can request that we correct inaccurate or incomplete information.
            </li>
            <li>
              <strong>Erasure:</strong> You can request that we delete your personal information.
            </li>
            <li>
              <strong>Restriction:</strong> You can request that we restrict the processing of your information.
            </li>
            <li>
              <strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and
              machine-readable format.
            </li>
            <li>
              <strong>Objection:</strong> You can object to our processing of your personal information.
            </li>
            <li>
              <strong>Withdraw Consent:</strong> You can withdraw consent at any time where we rely on consent to
              process your information.
            </li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section. We
            will respond to your request within the timeframe required by applicable law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. GDPR and CCPA Compliance</h2>
          <h3 className="text-xl font-medium mb-3">8.1 European Users (GDPR)</h3>
          <p className="mb-4">
            If you are a resident of the European Economic Area (EEA), you have certain rights under the General Data
            Protection Regulation (GDPR). We serve as the data controller for the information we collect. The legal
            bases for processing your information include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Consent:</strong> When you agree to our processing of your data.
            </li>
            <li>
              <strong>Contractual Necessity:</strong> Processing necessary to provide our services to you.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> Processing necessary for our legitimate business interests.
            </li>
            <li>
              <strong>Legal Obligation:</strong> Processing necessary to comply with legal requirements.
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">8.2 California Residents (CCPA)</h3>
          <p className="mb-4">
            If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA). In
            addition to the rights described above, California residents have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Know what personal information is collected, used, shared, or sold</li>
            <li>Delete personal information held by businesses</li>
            <li>Opt-out of the sale of personal information</li>
            <li>Non-discrimination for exercising CCPA rights</li>
          </ul>
          <p className="mb-4">
            We do not sell personal information as defined by the CCPA. In the preceding 12 months, we have collected
            the categories of personal information described in Section 1 of this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
          <p className="mb-4">
            Our application is not intended for children under 13 years of age. We do not knowingly collect personal
            information from children under 13. If you are a parent or guardian and believe your child has provided us
            with personal information, please contact us, and we will delete such information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
            Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on
            this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
          <div className="mb-4">
            <p>
              <strong>Email:</strong> privacy@postsync.com
            </p>
            <p>
              <strong>Address:</strong> I-10/2, Chanbeli Road, Islamabad ICT, Pakistan
            </p>
            <p>
              <strong>Phone:</strong> (555) 123-4567
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <FaRocket /> PostSync
            </div>
            <div className="footer-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-and-conditions">Terms of Service</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>PostSync © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy
