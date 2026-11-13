import { Link } from 'wouter';
import LegalPage from '@/components/layout/LegalPage';

const PRIVACY_EMAIL = 'info@kingsborough.org.uk';

const CookieNotice = () => (
  <LegalPage
    title="Cookie Notice"
    description="How Kingsborough Church uses cookies and similar technologies on its website, and the choices available to you."
    lastUpdated="13 November 2026"
  >
    <h2>1. Introduction</h2>
    <p>
      Kingsborough Church is committed to protecting your privacy and providing transparency about
      how information is collected and used when you visit our website.
    </p>
    <p>
      This Cookie Notice explains how cookies and similar technologies may be used on our website,
      the purposes they serve, and the choices available to you regarding their use.
    </p>
    <p>
      This notice should be read alongside our <Link href="/privacy-notice">Privacy Notice</Link>,
      which provides further information about how we collect, process and protect personal
      information.
    </p>

    <h2>2. What Are Cookies?</h2>
    <p>
      Cookies are small text files placed on your computer, smartphone, tablet or other device when
      you visit a website.
    </p>
    <p>
      They enable websites to recognise devices, remember certain preferences, support essential
      functionality and, where applicable, provide information about how visitors interact with
      website content.
    </p>
    <p>
      Cookies may be temporary, lasting only for the duration of a browsing session, or persistent,
      remaining on your device until they expire or are deleted.
    </p>
    <p>
      Similar technologies, including local storage and tracking technologies, may also be subject
      to the requirements described in this notice.
    </p>

    <h2>3. How We Use Cookies</h2>
    <p>Kingsborough Church may use cookies and similar technologies for the following purposes:</p>
    <ul>
      <li><strong>Essential Website Functionality:</strong> Supporting the operation, security and accessibility of our website.</li>
      <li><strong>User Preferences:</strong> Remembering selected website settings and preferences.</li>
      <li><strong>Website Performance:</strong> Understanding how our website performs and identifying opportunities for improvement.</li>
      <li><strong>Analytics:</strong> Measuring website visits and interactions where analytics services are enabled.</li>
      <li><strong>Third-Party Content:</strong> Supporting integrated content and services, such as embedded videos, maps or social media features.</li>
    </ul>
    <p>The specific technologies used will depend on the functionality enabled on our website.</p>
    <p>
      We will seek appropriate consent before using non-essential cookies or similar technologies
      where consent is required by law.
    </p>

    <h2>4. Types of Cookies</h2>

    <h3 className="font-semibold text-lg text-deepPurple pt-2">Strictly Necessary Cookies</h3>
    <p>
      These cookies are essential for providing services requested by visitors and supporting core
      website functionality.
    </p>
    <p>
      They may be used to maintain secure sessions, enable essential features and protect against
      security threats.
    </p>
    <p>Where the relevant legal exemption applies, these cookies do not require prior consent.</p>

    <h3 className="font-semibold text-lg text-deepPurple pt-2">Functional Cookies</h3>
    <p>
      Functional cookies support additional website features and may help remember preferences
      selected by visitors.
    </p>
    <p>
      Where these cookies are not covered by an applicable exemption, we will request consent before
      activating them.
    </p>

    <h3 className="font-semibold text-lg text-deepPurple pt-2">Analytics Cookies</h3>
    <p>
      Analytics cookies may help us understand how visitors use our website, including which pages
      are visited and how visitors interact with content.
    </p>
    <p>
      This information may assist us in improving website navigation, performance and accessibility.
    </p>
    <p>
      Where required by applicable legislation, analytics technologies will only be activated after
      consent has been obtained.
    </p>

    <h3 className="font-semibold text-lg text-deepPurple pt-2">Third-Party Cookies</h3>
    <p>
      Certain website features may be provided by external organisations, including video hosting
      platforms, social media services, mapping providers and other integrated services.
    </p>
    <p>
      These third parties may use cookies or similar technologies in accordance with their own
      privacy and cookie policies.
    </p>
    <p>
      Where such technologies require consent, we will take appropriate steps to obtain it before
      they are activated.
    </p>

    <h2>5. Managing Your Cookie Preferences</h2>
    <p>
      You may manage your preferences for non-essential cookies through the cookie controls provided
      on our website, where applicable.
    </p>
    <p>You may also use your browser settings to block or delete cookies.</p>
    <p>
      Please be aware that disabling certain cookies may affect the functionality or availability of
      some website features.
    </p>
    <p>
      Where we rely on your consent, you may withdraw it at any time through the available cookie
      preference controls.
    </p>
    <p>Withdrawing consent will not affect the lawfulness of processing carried out before the withdrawal.</p>

    <h2>6. Third-Party Services</h2>
    <p>Our website may incorporate content or functionality provided by third-party organisations.</p>
    <p>
      Where such services involve the use of cookies or similar technologies, their operation may be
      governed by the privacy and cookie policies of the relevant providers.
    </p>
    <p>
      We encourage visitors to review the policies of these third parties to understand their
      data-handling practices.
    </p>

    <h2>7. Cookie Duration</h2>
    <p>
      The period for which cookies remain on your device will depend on their purpose and
      configuration.
    </p>
    <p>
      Session cookies are generally removed when you close your browser, while persistent cookies may
      remain until they expire or are manually deleted.
    </p>
    <p>
      Information about the specific cookies used, their providers, purposes and duration should be
      made available through our website's cookie information or preference controls.
    </p>

    <h2>8. Updates to This Cookie Notice</h2>
    <p>
      We may update this Cookie Notice from time to time to reflect changes to our website, the
      technologies we use, applicable legislation or regulatory guidance.
    </p>
    <p>Any updates will be published on this page, together with the date of the latest revision.</p>

    <h2>9. Contact Us</h2>
    <p>
      If you have any questions concerning this Cookie Notice or our use of cookies and similar
      technologies, please contact:
    </p>
    <p>
      <strong>Kingsborough Church</strong><br />
      No. 4 New Windsor Street<br />
      Uxbridge, UB8 2TU<br />
      United Kingdom
    </p>
    <p>
      <strong>Email:</strong> <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a><br />
      <strong>Website:</strong>{' '}
      <a href="https://kingsborough.org.uk" target="_blank" rel="noopener noreferrer">kingsborough.org.uk</a>
    </p>
    <p>
      For further information about your data protection rights, please refer to our{' '}
      <Link href="/privacy-notice">Privacy Notice</Link>.
    </p>
  </LegalPage>
);

export default CookieNotice;
