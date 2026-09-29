import { PageShell, Replace } from '../components/PageShell';
import { SITE } from '../config/site';

export default function Privacy() {
  return (
    <PageShell title="Privacy Policy" path="/privacy-policy" description="How ToolNest handles your data: browser-based tools, cookies, analytics and advertising.">
      <p>Last updated: {SITE.lastUpdated}.</p>
      <p><Replace>This is a starting template, not legal advice. Have it reviewed against the laws that apply to you (for example GDPR, UK GDPR, CCPA or India’s DPDP Act) and update it to match the services you actually enable.</Replace></p>
      <h2>Who we are</h2>
      <p>{SITE.name} is operated by <Replace>legal name and address</Replace>. Contact: {SITE.contactEmail} <Replace>real email</Replace>.</p>
      <h2>Your tool input</h2>
      <p>The tools on this site are built to work in your browser. Numbers, text and images you enter are processed on your device and are not uploaded by the tools to our servers. Files are held in your browser’s memory only while the page is open and are not stored permanently.</p>
      <p>Your browser still connects to our hosting provider to load the site, and that provider may keep standard server logs such as IP address, page requested and time.</p>
      <h2>What is stored on your device</h2>
      <ul>
        <li>Your light/dark theme choice, saved in your browser’s local storage.</li>
        <li>Cookies or similar identifiers from analytics or advertising services, only if we enable them (see below).</li>
      </ul>
      <h2>Analytics</h2>
      <p>The site can be configured to use an analytics service to understand which pages are used. <Replace>State which provider you use (or delete this section if you use none), what it collects, and how people can opt out.</Replace></p>
      <h2>Advertising</h2>
      <p>We may show ads in the future. Ad networks may use cookies to show and measure ads. <Replace>Name your ad network(s) and link to their opt-out pages, and add a consent banner where required.</Replace></p>
      <h2>Contact form and email</h2>
      <p>If you email us, we use your message and address only to reply and improve the site.</p>
      <h2>Your rights</h2>
      <p>Depending on where you live you may have rights to access, correct or delete personal data we hold. Contact us to make a request.</p>
      <h2>Changes</h2>
      <p>We will update this page when our practices change and revise the date above.</p>
    </PageShell>
  );
}
