import { Mail } from 'lucide-react';
import { PageShell, Replace } from '../components/PageShell';
import { buttonClasses } from '../components/ui/Button';
import { SITE } from '../config/site';

export default function Contact() {
  return (
    <PageShell title="Contact" path="/contact" description="Contact the ToolNest team to report a problem, suggest a tool or ask a question.">
      <p>We read every message. Email us to report a bug, suggest a new tool, or ask a question about how a tool works.</p>
      <p>
        <a href={`mailto:${SITE.contactEmail}`} className={`${buttonClasses('primary', 'md')} !text-white !no-underline`}>
          <Mail className="h-4 w-4" aria-hidden="true" /> {SITE.contactEmail}
        </a>
      </p>
      <p><Replace>set the real email in src/config/site.ts (contactEmail) and add a business address or other details if required in your country.</Replace></p>
      <h2>Helpful details to include</h2>
      <ul>
        <li>The tool name and what you entered.</li>
        <li>What you expected and what happened instead.</li>
        <li>Your browser and device, for example Chrome on Android.</li>
      </ul>
      <p>Please don’t send sensitive personal or financial information by email. We can’t provide personal financial, tax or legal advice.</p>
    </PageShell>
  );
}
