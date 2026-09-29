import { PageShell, Replace } from '../components/PageShell';
import { SITE } from '../config/site';

export default function Terms() {
  return (
    <PageShell title="Terms of Service" path="/terms-of-service" description="The terms for using ToolNest's free online tools, including disclaimers and acceptable use.">
      <p>Last updated: {SITE.lastUpdated}.</p>
      <p><Replace>Starting template, not legal advice. Have it reviewed for your jurisdiction and business structure.</Replace></p>
      <h2>Using the tools</h2>
      <p>By using {SITE.name} you agree to these terms. The tools are provided free of charge for personal and business use. Please don’t misuse the site, attempt to disrupt it, or use automated means to overload it.</p>
      <h2>Results are estimates</h2>
      <p>Calculators use standard formulas and are intended for general information. They are not financial, tax, legal or professional advice. Real figures from lenders, tax authorities or other providers may differ, so confirm anything important with them.</p>
      <h2>No warranty</h2>
      <p>The tools are provided “as is” without warranties of any kind. We do our best to keep them accurate and available but do not guarantee that they are error-free or uninterrupted.</p>
      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, {SITE.name} is not liable for losses arising from your use of, or reliance on, the tools or their results. <Replace>Have a lawyer confirm the wording for your jurisdiction.</Replace></p>
      <h2>Your content</h2>
      <p>You keep ownership of any text or files you process. Because processing happens in your browser, we don’t receive that content through the tools.</p>
      <h2>Third-party links, ads and services</h2>
      <p>The site may contain advertising or links to third-party sites. We are not responsible for their content or practices.</p>
      <h2>Changes and contact</h2>
      <p>We may update these terms and will revise the date above when we do. Questions? Email {SITE.contactEmail} <Replace>real email</Replace>.</p>
    </PageShell>
  );
}
