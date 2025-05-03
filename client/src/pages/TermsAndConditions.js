import { Link } from "react-router-dom"
import { FaRocket, FaArrowLeft } from "react-icons/fa"

const TermsAndConditions = () => {
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
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to PostSync ("we," "our," or "us"). These Terms and Conditions govern your use of our social media
            management application and website (collectively, the "Service").
          </p>
          <p className="mb-4">
            By accessing or using the Service, you agree to be bound by these Terms and Conditions. If you disagree with
            any part of these terms, you may not access the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>"Application"</strong> refers to PostSync, the social media management tool.
            </li>
            <li>
              <strong>"Personal Data"</strong> refers to data about a living individual who can be identified from that
              data.
            </li>
            <li>
              <strong>"Service"</strong> refers to the Application and website.
            </li>
            <li>
              <strong>"Terms"</strong> refers to these Terms and Conditions.
            </li>
            <li>
              <strong>"User"</strong> refers to the individual accessing or using the Service.
            </li>
            <li>
              <strong>"Instagram"</strong> refers to the social media platform owned by Meta Platforms, Inc.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Eligibility</h2>
          <p className="mb-4">To use our Service, you must:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Be at least 18 years of age</li>
            <li>Register for an account with accurate, complete, and current information</li>
            <li>
              Be the owner or authorized administrator of the Instagram Business account you connect to our Service
            </li>
            <li>
              Comply with these Terms and all applicable local, state, national, and international laws and regulations
            </li>
          </ul>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You must immediately notify us of any unauthorized use of your account or any
            other breach of security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Description of Services</h2>
          <p className="mb-4">PostSync provides the following services:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Instagram Account Management:</strong> Tools to manage and analyze your Instagram Business account
            </li>
            <li>
              <strong>Content Scheduling:</strong> Ability to schedule and publish posts to your Instagram account
            </li>
            <li>
              <strong>Analytics and Insights:</strong> Data analysis and reporting on your Instagram account performance
            </li>
            <li>
              <strong>Media Management:</strong> Tools to organize and manage your Instagram media content
            </li>
          </ul>
          <p className="mb-4">
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without
            notice to you. We will not be liable to you or any third party for any modification, suspension, or
            discontinuation of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Instagram and Facebook Integration</h2>
          <p className="mb-4">
            Our Service integrates with Instagram through the Instagram Graph API and Facebook Login. By connecting your
            Instagram Business account to our Service, you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Authorize us to access your Instagram data as described in our Privacy Policy</li>
            <li>Confirm that you are the owner or authorized administrator of the Instagram Business account</li>
            <li>Agree to comply with Instagram's Terms of Use and Community Guidelines</li>
            <li>
              Understand that our Service's functionality depends on Instagram's API, which may change without notice
            </li>
          </ul>
          <p className="mb-4">
            We are not responsible for any changes to Instagram's API that may affect our Service. If Instagram modifies
            or restricts access to its API, some features of our Service may become unavailable or function differently.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. User Obligations</h2>
          <p className="mb-4">As a user of our Service, you agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete information when registering and using the Service</li>
            <li>Only connect Instagram Business accounts that you own or have authorization to manage</li>
            <li>
              Comply with all applicable laws and regulations, including those related to data privacy, intellectual
              property, and online conduct
            </li>
            <li>Not use the Service for any illegal or unauthorized purpose</li>
            <li>
              Not attempt to interfere with, compromise the system integrity or security, or decipher any transmissions
              to or from the servers running the Service
            </li>
            <li>Not upload or transmit viruses, malware, or other malicious code</li>
            <li>Not use automated scripts to collect information from or interact with the Service</li>
            <li>
              Not impersonate another person or entity or falsely state or misrepresent your affiliation with a person
              or entity
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Content and Intellectual Property</h2>
          <h3 className="text-xl font-medium mb-3">7.1 Your Content</h3>
          <p className="mb-4">
            You retain all rights to the content you post, upload, or share through our Service. By using our Service to
            manage your Instagram content, you grant us a non-exclusive, worldwide, royalty-free license to use,
            reproduce, process, adapt, and publish your content solely for the purpose of providing the Service to you.
          </p>

          <h3 className="text-xl font-medium mb-3">7.2 Our Intellectual Property</h3>
          <p className="mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property
            of PostSync and its licensors. The Service is protected by copyright, trademark, and other laws. Our
            trademarks and trade dress may not be used in connection with any product or service without our prior
            written consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, in no event shall PostSync, its directors, employees, partners,
            agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive
            damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
            resulting from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            <li>Changes to Instagram's API or policies that affect our Service</li>
            <li>Any interruption or cessation of transmission to or from the Service</li>
          </ul>
          <p className="mb-4">
            Our liability shall be limited to the maximum extent permitted by law in the jurisdiction where you reside.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
          <p className="mb-4">
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
            basis. The Service is provided without warranties of any kind, whether express or implied, including, but
            not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement,
            or course of performance.
          </p>
          <p className="mb-4">PostSync does not warrant that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>The Service will function uninterrupted, secure, or available at any particular time or location</li>
            <li>Any errors or defects will be corrected</li>
            <li>The Service is free of viruses or other harmful components</li>
            <li>The results of using the Service will meet your requirements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior notice or
            liability, for any reason, including, without limitation, if you breach these Terms.
          </p>
          <p className="mb-4">
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
            account, you may simply discontinue using the Service or contact us to request account deletion.
          </p>
          <p className="mb-4">
            All provisions of these Terms which by their nature should survive termination shall survive termination,
            including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
            liability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
          <p className="mb-4">
            You agree to defend, indemnify, and hold harmless PostSync, its directors, employees, partners, agents,
            suppliers, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including
            without limitation reasonable attorney's fees and costs, arising out of or in any way connected with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your access to or use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>
              Your violation of any third-party right, including without limitation any intellectual property right,
              publicity, confidentiality, property, or privacy right
            </li>
            <li>Any content you post, upload, or share through the Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without
            regard to its conflict of law provisions.
          </p>
          <p className="mb-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
            rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
            provisions of these Terms will remain in effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Dispute Resolution</h2>
          <p className="mb-4">
            Any disputes arising out of or related to these Terms or the Service shall be resolved through the following
            process:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              Informal Negotiation: We will first attempt to resolve any dispute informally through good-faith
              negotiations.
            </li>
            <li>
              Mediation: If the dispute cannot be resolved through negotiation, either party may initiate mediation
              conducted by a mutually agreed-upon mediator.
            </li>
            <li>
              Arbitration: If mediation is unsuccessful, the dispute will be resolved by binding arbitration in [Your
              Jurisdiction] in accordance with the rules of [Arbitration Association].
            </li>
          </ol>
          <p className="mb-4">
            Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of
            competent jurisdiction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
            provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change
            will be determined at our sole discretion.
          </p>
          <p className="mb-4">
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Entire Agreement</h2>
          <p className="mb-4">
            These Terms constitute the entire agreement between you and PostSync regarding the Service and supersede all
            prior and contemporaneous written or oral agreements, understandings, and communications.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Contact Us</h2>
          <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
          <div className="mb-4">
            <p>
              <strong>Email:</strong> legal@postsync.com
            </p>
            <p>
              <strong>Address:</strong> I-10/2, Chanbeli Road, Islamabad ICT, Pakistan
            </p>
            <p>
              <strong>Phone:</strong> 1234567890
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

export default TermsAndConditions
