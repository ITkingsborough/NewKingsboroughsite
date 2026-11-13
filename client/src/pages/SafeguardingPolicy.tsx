import { Link } from 'wouter';
import LegalPage from '@/components/layout/LegalPage';

const SafeguardingPolicy = () => (
  <LegalPage
    title="Safeguarding Policy"
    description="Kingsborough Church's commitment to safeguarding children, young people and adults at risk."
    lastUpdated="November 2026"
  >
    <p>
      Kingsborough Church (registered charity no. 1112820, company no. 05539255) believes that every
      person is precious and made in the image of God. We are committed to creating a safe place
      for everyone who attends our services, groups and events, and to protecting children, young
      people and adults at risk from harm, abuse and neglect.
    </p>

    <h2>Our commitments</h2>
    <ul>
      <li>We will always put the welfare of children and adults at risk first.</li>
      <li>We will follow UK law and national safeguarding guidance, including the Children Act and the Care Act.</li>
      <li>We will treat everyone with respect, dignity and without discrimination.</li>
      <li>We will listen to and take seriously any concern, allegation or disclosure.</li>
    </ul>

    <h2>Safer recruitment and training</h2>
    <ul>
      <li>All volunteers and staff working with children or adults at risk are carefully recruited, with references and appropriate DBS checks.</li>
      <li>Everyone involved in our activities receives safeguarding guidance suited to their role, and training is refreshed regularly.</li>
      <li>We keep to safe ratios of adults to children and avoid situations where an adult is alone and unobserved with a child.</li>
    </ul>

    <h2>Safeguarding Lead</h2>
    <p>
      Our church leadership appoints a Safeguarding Lead who receives and acts on safeguarding
      concerns. The Safeguarding Lead can be reached through the church office on 01895 252224 or at{' '}
      <a href="mailto:info@kingsborough.org.uk">info@kingsborough.org.uk</a>.
    </p>

    <h2>If you have a concern</h2>
    <ul>
      <li>If someone is in immediate danger, call <strong>999</strong>.</li>
      <li>Otherwise, tell our Safeguarding Lead as soon as possible, in person, by phone or by email.</li>
      <li>Write down what you saw or were told, using the person's own words, and do not promise to keep it secret.</li>
      <li>Do not investigate or confront the person concerned. Our Safeguarding Lead will decide the next steps and refer to the local authority or police where needed.</li>
    </ul>
    <p>
      You can also contact the NSPCC helpline on <strong>0808 800 5000</strong> or Childline on{' '}
      <strong>0800 1111</strong> at any time. Concerns about an adult can be raised with the local
      authority adult safeguarding team.
    </p>

    <h2>Confidentiality and record keeping</h2>
    <p>
      Safeguarding information is shared only with those who need to know, in line with our{' '}
      <Link href="/privacy-notice">Privacy Notice</Link> and data protection law. Records are stored securely.
    </p>

    <h2>Responding to concerns about a leader or volunteer</h2>
    <p>
      Any concern about the conduct of a leader, staff member or volunteer is taken seriously,
      reported to the Safeguarding Lead (or to a trustee if the concern involves the Safeguarding Lead)
      and, where appropriate, referred to the statutory authorities and the Charity Commission.
    </p>

    <h2>Review</h2>
    <p>This policy is reviewed at least once a year by the trustees and whenever legislation or guidance changes.</p>
  </LegalPage>
);

export default SafeguardingPolicy;
