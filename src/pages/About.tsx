import { PageShell } from '../components/PageShell';
import { SITE } from '../config/site';

export default function About() {
  return (
    <PageShell title="About ToolNest" path="/about" description="ToolNest is a collection of free online calculators, converters, text and image tools that work in your browser.">
      <p>{SITE.name} is a growing collection of free online tools for everyday tasks: working out a loan payment, adding GST to a price, counting words, or shrinking a photo before you email it.</p>
      <h2>What we care about</h2>
      <ul>
        <li><strong>Useful first.</strong> Each tool does one job clearly, explains what it is doing and shows an example.</li>
        <li><strong>Private where possible.</strong> Calculators, text tools, the QR generator and image tools run in your browser. We don’t upload your files or text to process them.</li>
        <li><strong>Fast and light.</strong> Tools load only when you open them.</li>
        <li><strong>Honest.</strong> Results are estimates from standard formulas. For financial, tax or legal decisions, check with an official source or professional.</li>
      </ul>
      <h2>How the site is funded</h2>
      <p>The site is free to use. To cover hosting and development we may show advertising or offer optional paid extras in the future. Ads will always be clearly labelled.</p>
      <h2>Who runs it</h2>
      <p><mark className="rounded bg-amber-100 px-1 text-amber-900">[REPLACE: add a short paragraph about you or your team, and where you are based.]</mark></p>
      <p>Questions or ideas? Visit the <a href="/contact">contact page</a>.</p>
    </PageShell>
  );
}
