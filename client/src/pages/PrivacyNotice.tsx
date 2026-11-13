import { Link } from 'wouter';
import LegalPage from '@/components/layout/LegalPage';

const PRIVACY_EMAIL = 'info@kingsborough.org.uk';

const PrivacyNotice = () => (
  <LegalPage
    title="Privacy Notice"
    description="How Kingsborough Church collects, uses, stores, shares and protects your personal data."
    lastUpdated="13 November 2026"
  >
    <h2>1. Introduction</h2>
    <p>
      Kingsborough Church is committed to protecting and respecting your privacy. We recognise the
      importance of safeguarding personal information entrusted to us and are dedicated to handling
      such information responsibly, securely and transparently.
    </p>
    <p>
      This Privacy Notice explains how we collect, use, store, share and protect your personal data
      when you visit our website, contact us, participate in church activities or engage with our
      ministries and services.
    </p>
    <p>
      We process personal information in accordance with applicable UK data protection legislation,
      including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
    </p>

    <h2>2. Who We Are</h2>
    <p>
      Kingsborough Church is a Christian faith-based organisation dedicated to worship, spiritual
      growth, community engagement and sharing the Gospel of Jesus Christ.
    </p>
    <p>
      For the purposes of applicable data protection legislation, the organisation legally
      responsible for determining how and why your personal information is processed is referred to
      as the <em>Data Controller</em>.
    </p>
    <p>
      <strong>Organisation:</strong> Kingsborough Church<br />
      <strong>Address:</strong> No. 4 New Windsor Street, Uxbridge, UB8 2TU, United Kingdom<br />
      <strong>Privacy Contact:</strong> <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
    </p>

    <h2>3. Information We Collect</h2>
    <p>
      Depending on how you interact with Kingsborough Church, we may collect and process the
      following categories of personal information:
    </p>
    <ul>
      <li><strong>Personal identification information:</strong> Your name and other identifying details voluntarily provided to us.</li>
      <li><strong>Contact information:</strong> Your email address, telephone number and postal address, where applicable.</li>
      <li><strong>Church participation information:</strong> Information relating to membership, ministry involvement, volunteering and participation in church programmes.</li>
      <li><strong>Enquiry and communication records:</strong> Information provided through contact forms, prayer requests, testimonies, feedback and correspondence.</li>
      <li><strong>Event information:</strong> Details submitted when registering for church events, conferences and other activities.</li>
      <li><strong>Donation information:</strong> Records of contributions and transactions, where applicable.</li>
      <li><strong>Technical information:</strong> Information such as your IP address, browser type, device information and website usage data, where collected.</li>
      <li><strong>Photographs and recordings:</strong> Images, audio and video recordings captured or submitted in connection with church activities, where applicable.</li>
    </ul>
    <p>We aim to collect only the personal information reasonably necessary for the purposes for which it is processed.</p>

    <h2>4. How We Use Your Information</h2>
    <p>We may process your personal information for the following purposes:</p>
    <ul>
      <li>Responding to enquiries, requests and communications.</li>
      <li>Providing information about church services, ministries and activities.</li>
      <li>Administering event registrations and participation.</li>
      <li>Supporting pastoral care and responding to prayer requests.</li>
      <li>Managing church membership and volunteer activities.</li>
      <li>Processing and maintaining appropriate records of donations.</li>
      <li>Maintaining the security, reliability and functionality of our website.</li>
      <li>Improving our services and the experience of website visitors.</li>
      <li>Fulfilling applicable legal, regulatory and administrative obligations.</li>
    </ul>
    <p>Where required by law, we will obtain your consent before processing your information for specific purposes.</p>

    <h2>5. Lawful Basis for Processing Personal Data</h2>
    <p>
      Kingsborough Church processes personal information only where an appropriate lawful basis
      applies under Article 6 of the UK GDPR.
    </p>
    <p>Depending on the circumstances, these may include:</p>
    <p>
      <strong>Consent:</strong> Where you have freely given your permission for a specific use of
      your personal information.
    </p>
    <p>
      <strong>Legitimate Interests:</strong> Where processing is reasonably necessary for the
      administration, operation and charitable or religious activities of the church, provided
      these interests are not overridden by your rights and freedoms.
    </p>
    <p>
      <strong>Legal Obligations:</strong> Where processing is necessary to comply with applicable
      laws and regulations.
    </p>
    <p>
      <strong>Contractual Necessity:</strong> Where processing is required to provide a service or
      fulfil an agreement with you.
    </p>
    <p>
      The applicable lawful basis will depend on the particular purpose for which your information
      is collected and used.
    </p>

    <h2>6. Sensitive Personal Information</h2>
    <p>
      In the course of our religious activities, we may process information revealing religious
      beliefs or other sensitive personal information, including information voluntarily provided
      through prayer requests or pastoral communications.
    </p>
    <p>
      Such information is recognised as <em>special category personal data</em> under the UK GDPR
      and is subject to additional protections.
    </p>
    <p>
      We will process this information only where an appropriate lawful basis and special category
      condition apply, including, where relevant, the provisions relating to legitimate activities
      of qualifying not-for-profit religious organisations or explicit consent.
    </p>
    <p>
      Access to sensitive personal information will be restricted to appropriately authorised
      individuals, and we will apply additional safeguards where necessary.
    </p>

    <h2>7. Sharing Your Information</h2>
    <p>Kingsborough Church does not sell personal information.</p>
    <p>
      We may share personal information with authorised staff, church representatives, volunteers
      and trusted service providers where necessary for legitimate church activities, website
      operation or compliance with legal obligations.
    </p>
    <p>
      Such sharing will be limited to what is necessary and will take place subject to applicable
      data protection requirements.
    </p>
    <p>
      Where personal information is processed by external service providers on our behalf, we will
      seek to ensure that appropriate contractual and security safeguards are in place.
    </p>

    <h2>8. Data Security</h2>
    <p>
      We take reasonable and appropriate technical and organisational measures to protect personal
      information against unauthorised access, accidental loss, misuse, alteration and unlawful
      disclosure.
    </p>
    <p>
      These measures may include access restrictions, secure systems, appropriate authentication
      procedures and periodic reviews of our data-handling practices.
    </p>
    <p>
      Although we take steps to protect information entrusted to us, no method of transmission over
      the internet or electronic storage can be guaranteed to be completely secure.
    </p>

    <h2>9. Data Retention</h2>
    <p>
      We retain personal information only for as long as reasonably necessary to fulfil the purposes
      for which it was collected, including any applicable legal, accounting, safeguarding or
      reporting requirements.
    </p>
    <p>Retention periods may vary depending on the nature of the information and the relevant processing purpose.</p>
    <p>
      When personal information is no longer required, we will take appropriate steps to securely
      delete, anonymise or otherwise dispose of it in accordance with our retention procedures.
    </p>

    <h2>10. Cookies and Website Technologies</h2>
    <p>
      Our website may use cookies and similar technologies to support essential functionality,
      maintain security and, where enabled, understand how visitors interact with our website.
    </p>
    <p>
      Where consent is legally required for non-essential cookies or similar technologies, we will
      provide appropriate information and obtain the necessary consent before using them.
    </p>
    <p>For further information, please refer to our <Link href="/cookie-notice">Cookie Notice</Link>.</p>

    <h2>11. Your Data Protection Rights</h2>
    <p>
      Under applicable UK data protection legislation, you may have the following rights, subject
      to the relevant legal conditions and exemptions:
    </p>
    <ul>
      <li>The right to be informed about how your personal information is used.</li>
      <li>The right to request access to your personal information.</li>
      <li>The right to request correction of inaccurate or incomplete information.</li>
      <li>The right to request erasure of your personal information in certain circumstances.</li>
      <li>The right to request restriction of processing.</li>
      <li>The right to object to certain processing activities.</li>
      <li>The right to data portability, where applicable.</li>
      <li>The right to withdraw consent at any time where processing relies on consent.</li>
    </ul>
    <p>
      <strong>
        You also have the right to object to processing based on legitimate interests and, where
        applicable, to processing for direct marketing.
      </strong>
    </p>
    <p>To exercise any applicable rights, please contact us using the details provided in this notice.</p>

    <h2>12. Children's Privacy</h2>
    <p>We recognise the importance of protecting children's personal information.</p>
    <p>
      Where personal information relating to children is collected in connection with our
      activities or online services, we will take appropriate measures to ensure that it is handled
      securely and in accordance with applicable data protection and safeguarding requirements.
    </p>
    <p>
      Where required, we will obtain appropriate consent or authorisation and provide privacy
      information suitable for the individuals concerned.
    </p>

    <h2>13. Third-Party Websites and Services</h2>
    <p>
      Our website may contain links to external websites, social media platforms and third-party
      services.
    </p>
    <p>
      Kingsborough Church is not responsible for the privacy practices of independently operated
      third-party websites.
    </p>
    <p>
      We encourage visitors to review the privacy notices of external services before providing
      personal information.
    </p>

    <h2>14. Changes to This Privacy Notice</h2>
    <p>
      We may update this Privacy Notice periodically to reflect changes in our operations, website
      functionality, legal requirements or data protection practices.
    </p>
    <p>
      Any revised notice will be published on our website with an updated revision date. Where
      required, we will take additional steps to inform affected individuals of significant changes.
    </p>

    <h2>15. Contact Us</h2>
    <p>
      If you have questions, concerns or requests concerning this Privacy Notice or the handling of
      your personal information, please contact:
    </p>
    <p>
      <strong>Kingsborough Church</strong><br />
      No. 4 New Windsor Street<br />
      Uxbridge, UB8 2TU<br />
      United Kingdom
    </p>
    <p>
      <strong>Email:</strong> <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>
    </p>
    <p>
      You also have the right to raise a complaint with the Information Commissioner's Office
      (ICO), the UK's independent data protection regulator.
    </p>
    <p>
      <strong>Information Commissioner's Office</strong><br />
      Website:{' '}
      <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a>
      <br />
      Telephone: 0303 123 1113
    </p>
    <p>We encourage you to contact us first so that we have an opportunity to address your concerns.</p>
  </LegalPage>
);

export default PrivacyNotice;
