import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  AlignLeft, ArrowLeftRight, Cake, CaseSensitive, ImageDown, Landmark, Percent, QrCode, Receipt, Scaling,
  type LucideIcon,
} from 'lucide-react';
import { getCategory, type CategoryId } from './categories';

export interface FAQItem { q: string; a: string }

export interface ToolMeta {
  slug: string; // URL: /tools/:slug
  name: string;
  description: string; // short card text
  categories: CategoryId[]; // first = primary category
  icon: LucideIcon;
  keywords: string[]; // used by search
  popular?: boolean;
  localOnly?: boolean; // shows the "processed in your browser" note
  seoTitle: string;
  seoDescription: string;
  intro: string;
  howTo: string[];
  example: string;
  faqs: FAQItem[];
  component: LazyExoticComponent<ComponentType>;
}

export const toolPath = (t: { slug: string }) => `/tools/${t.slug}`;

/**
 * CENTRAL TOOL REGISTRY.
 * To add a tool: create src/tools/MyTool.tsx (default export), then add one entry below.
 * Routing, search, category pages, sitemap, SEO tags and structured data all pick it up automatically.
 */
export const tools: ToolMeta[] = [
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Find your exact age in years, months and days, plus your next birthday.',
    categories: ['calculators'],
    icon: Cake,
    keywords: ['age', 'birthday', 'date of birth', 'dob', 'years', 'days between dates'],
    popular: true,
    localOnly: true,
    seoTitle: 'Age Calculator – Exact Age in Years, Months & Days',
    seoDescription: 'Free age calculator. Enter a date of birth to get your exact age in years, months and days, total days lived and the countdown to your next birthday.',
    intro: 'This age calculator works out the exact time between a date of birth and another date, which is today by default. Along with years, months and days it shows the total number of days lived and how long until the next birthday.',
    howTo: [
      'Enter the date of birth.',
      'Leave “Age at” on today’s date, or pick a different date to see the age on that day.',
      'Read the result. It updates as you change either date. Use Reset to start over.',
    ],
    example: 'Born on 15 March 1995 and calculated on 10 June 2025, the age is 30 years, 2 months and 26 days.',
    faqs: [
      { q: 'How are months and days counted?', a: 'Whole years are counted first, then whole months, and the remainder is the days. This is the way ages are normally stated.' },
      { q: 'Can I find the age on a past or future date?', a: 'Yes. Change the “Age at” date to any date on or after the date of birth.' },
      { q: 'What happens with a 29 February birthday?', a: 'The calculator handles leap days. In non-leap years the next-birthday countdown uses 1 March.' },
    ],
    component: lazy(() => import('../tools/AgeCalculator')),
  },
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Calculate loan EMI, total interest and a year-by-year repayment schedule.',
    categories: ['finance', 'calculators'],
    icon: Landmark,
    keywords: ['emi', 'loan', 'home loan', 'car loan', 'personal loan', 'interest', 'mortgage', 'repayment'],
    popular: true,
    localOnly: true,
    seoTitle: 'EMI Calculator – Loan EMI, Interest & Repayment Schedule',
    seoDescription: 'Free EMI calculator for home, car and personal loans. Get your monthly EMI, total interest, total payment and a yearly repayment breakdown.',
    intro: 'An EMI (equated monthly instalment) is the fixed amount you pay each month to repay a loan. This calculator uses the standard reducing-balance formula to show your EMI, the total interest you will pay, and how the balance falls year by year.',
    howTo: [
      'Enter the loan amount and the annual interest rate.',
      'Enter the tenure and choose years or months.',
      'Review the EMI, total interest and total payment. Open the yearly schedule for the breakdown.',
    ],
    example: 'A loan of ₹10,00,000 at 9% a year for 5 years has an EMI of about ₹20,758. Total repayment is roughly ₹12.46 lakh, of which about ₹2.46 lakh is interest.',
    faqs: [
      { q: 'Which formula is used?', a: 'EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the principal, r the monthly rate (annual rate ÷ 12 ÷ 100) and n the number of months.' },
      { q: 'Will this match my bank’s figure exactly?', a: 'It should be very close. Lenders may round differently or add processing fees, insurance or a different day-count, so treat this as an estimate and confirm with your lender.' },
      { q: 'What if the interest rate is 0%?', a: 'The calculator divides the principal equally across the months.' },
    ],
    component: lazy(() => import('../tools/EmiCalculator')),
  },
  {
    slug: 'gst-calculator',
    name: 'GST Calculator',
    description: 'Add or remove GST from a price and see the CGST, SGST and IGST split.',
    categories: ['finance', 'calculators'],
    icon: Receipt,
    keywords: ['gst', 'tax', 'cgst', 'sgst', 'igst', 'invoice', 'vat', 'inclusive', 'exclusive'],
    popular: true,
    localOnly: true,
    seoTitle: 'GST Calculator – Add or Remove GST (CGST, SGST, IGST)',
    seoDescription: 'Free GST calculator. Add GST to a base price or remove it from a GST-inclusive price and see the GST amount with the CGST/SGST split.',
    intro: 'Use this GST calculator to work out the tax on a price, or to find the original price from an amount that already includes GST. It also shows how the tax splits into CGST and SGST for in-state sales, or IGST for inter-state sales.',
    howTo: [
      'Choose “Add GST” if your amount excludes tax, or “Remove GST” if it already includes tax.',
      'Enter the amount and pick a GST rate, or type your own.',
      'Read the base price, GST amount and final total.',
    ],
    example: 'Adding 18% GST to ₹10,000 gives GST of ₹1,800 and a total of ₹11,800. Removing 18% GST from ₹11,800 returns the base price of ₹10,000.',
    faqs: [
      { q: 'Which GST rate should I use?', a: 'The rate depends on the product or service. India’s current main slabs are 5%, 18% and 40%, with some items at 0% or special rates such as 3%. Check the official GST rate schedule or your invoice for the exact rate.' },
      { q: 'What is the difference between CGST/SGST and IGST?', a: 'For sales within one state, GST is split equally into CGST (central) and SGST (state). For sales between states, the whole amount is charged as IGST.' },
      { q: 'Is this tax advice?', a: 'No. It is a calculation aid. Confirm rates and filing rules with the GST portal or a tax professional.' },
    ],
    component: lazy(() => import('../tools/GstCalculator')),
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Percent of a number, what percent one number is of another, and percentage change.',
    categories: ['calculators'],
    icon: Percent,
    keywords: ['percentage', 'percent', '%', 'increase', 'decrease', 'discount', 'change', 'ratio'],
    popular: true,
    localOnly: true,
    seoTitle: 'Percentage Calculator – Percent Of, Percent Change & More',
    seoDescription: 'Free percentage calculator. Find X% of a number, what percent one number is of another, percentage increase or decrease, and add or subtract a percentage.',
    intro: 'Four common percentage questions in one place: what is X% of Y, X is what percent of Y, how much has a value changed in percent, and what is a number after adding or subtracting a percentage, such as a discount or markup.',
    howTo: [
      'Pick the kind of question you want to answer.',
      'Fill in the two values. The labels change to match the question.',
      'Read the answer and the formula shown beneath it.',
    ],
    example: '15% of 200 is 30. Going from 80 to 100 is a 25% increase. A price of 500 reduced by 20% becomes 400.',
    faqs: [
      { q: 'How do I calculate a discount?', a: 'Choose “Increase or decrease a number”, set it to decrease, enter the price and the discount percentage.' },
      { q: 'Why is percentage change undefined when the starting value is 0?', a: 'Percentage change divides by the starting value, and dividing by zero has no meaning. The calculator asks for a non-zero starting value.' },
      { q: 'Can I use decimals or negative numbers?', a: 'Yes. Decimals and negative values are accepted where they make sense.' },
    ],
    component: lazy(() => import('../tools/PercentageCalculator')),
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature, area, volume, speed, time and data.',
    categories: ['converters'],
    icon: ArrowLeftRight,
    keywords: ['unit', 'convert', 'length', 'weight', 'mass', 'temperature', 'celsius', 'fahrenheit', 'km', 'miles', 'kg', 'pounds', 'liters'],
    popular: true,
    localOnly: true,
    seoTitle: 'Unit Converter – Length, Weight, Temperature, Area & More',
    seoDescription: 'Free unit converter for length, mass, temperature, area, volume, speed, time and digital storage. Instant results with a full conversion table.',
    intro: 'Pick a category, choose the units and type a value. The result appears instantly, along with the same value in every other unit of that category so you can pick what you need.',
    howTo: [
      'Choose a category such as Length or Temperature.',
      'Select the “From” and “To” units, or use the swap button.',
      'Enter a value to see the result and the full conversion table.',
    ],
    example: '10 kilometres is 6.2137 miles. 100 °C is 212 °F. 5 pounds is about 2.268 kilograms.',
    faqs: [
      { q: 'How accurate are the conversions?', a: 'They use standard exact or internationally agreed factors, and results are shown with up to 8 decimal places.' },
      { q: 'What is the difference between KB and KiB?', a: 'KB uses 1,000 bytes; KiB uses 1,024 bytes. Both are provided in the data category.' },
      { q: 'Which gallon and ounce are used?', a: 'Volume units follow US customary definitions (US gallon, US fluid ounce, US cup).' },
    ],
    component: lazy(() => import('../tools/UnitConverter')),
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences and paragraphs, with reading time.',
    categories: ['text-tools', 'productivity'],
    icon: AlignLeft,
    keywords: ['word', 'count', 'characters', 'letters', 'sentences', 'paragraphs', 'reading time', 'text'],
    popular: true,
    localOnly: true,
    seoTitle: 'Word Counter – Count Words, Characters & Reading Time',
    seoDescription: 'Free word counter. Paste or type text to count words, characters, sentences and paragraphs and estimate reading and speaking time.',
    intro: 'Paste or type your text and the counts update instantly. Useful for essays, articles, social posts, meta descriptions and anywhere a length limit applies. Your text stays in your browser.',
    howTo: [
      'Type or paste your text into the box.',
      'Check the counts and time estimates below the box.',
      'Use Clear to start again.',
    ],
    example: 'A 500-word article takes about 2 minutes to read at 238 words per minute and about 3 minutes and 20 seconds to speak at 150 words per minute.',
    faqs: [
      { q: 'How are words counted?', a: 'Any run of characters separated by whitespace is one word.' },
      { q: 'How is reading time estimated?', a: 'Reading time assumes 238 words per minute and speaking time 150 words per minute. Real speed varies from person to person.' },
      { q: 'Is my text saved anywhere?', a: 'No. Counting happens in your browser and the text is not sent by this tool to a server.' },
    ],
    component: lazy(() => import('../tools/WordCounter')),
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Change text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more.',
    categories: ['text-tools'],
    icon: CaseSensitive,
    keywords: ['case', 'uppercase', 'lowercase', 'title case', 'sentence case', 'camelcase', 'snake_case', 'kebab-case', 'text'],
    localOnly: true,
    seoTitle: 'Case Converter – Uppercase, Lowercase, Title Case, camelCase',
    seoDescription: 'Free online case converter. Convert text to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case and more.',
    intro: 'Paste text, choose a style, and copy the result. It covers everyday writing styles such as Title Case and Sentence case, and naming styles used in code such as camelCase and snake_case.',
    howTo: [
      'Type or paste your text.',
      'Select the case style you want.',
      'Copy the converted text.',
    ],
    example: '“hello world example” becomes “Hello World Example” in Title Case, “helloWorldExample” in camelCase and “hello_world_example” in snake_case.',
    faqs: [
      { q: 'Does Title Case follow a style guide?', a: 'No. It capitalizes the first letter of every word. Style guides such as AP or Chicago keep some small words lowercase, so review headings by hand.' },
      { q: 'How are camelCase and snake_case built?', a: 'The text is split into words at spaces, punctuation and existing case changes, then rejoined in the chosen style.' },
      { q: 'Is my text uploaded?', a: 'No. Conversion happens in your browser.' },
    ],
    component: lazy(() => import('../tools/CaseConverter')),
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create a QR code for a link or text and download it as PNG or SVG.',
    categories: ['productivity', 'developer-tools'],
    icon: QrCode,
    keywords: ['qr', 'qr code', 'barcode', 'link', 'url', 'generator', 'scan'],
    popular: true,
    localOnly: true,
    seoTitle: 'QR Code Generator – Free QR Codes as PNG or SVG',
    seoDescription: 'Free QR code generator. Turn a link or text into a QR code, adjust size, colours and error correction, and download it as PNG or SVG.',
    intro: 'Enter a web address or any text and get a QR code instantly. Codes are generated in your browser, do not expire and contain no tracking. Download as PNG for documents or SVG for print.',
    howTo: [
      'Type or paste the link or text.',
      'Adjust size, colours and error correction if needed. Keep strong contrast between the two colours.',
      'Download the PNG or SVG, then test it with your phone before printing.',
    ],
    example: 'Entering https://example.com creates a code that opens that page when scanned with a phone camera.',
    faqs: [
      { q: 'Do these QR codes expire?', a: 'No. The data is stored in the code itself. It will keep working as long as the destination link does.' },
      { q: 'What is error correction?', a: 'Higher levels let a code still scan when partly damaged or covered, at the cost of a denser pattern. Medium (M) suits most uses.' },
      { q: 'Why does my code not scan?', a: 'Low contrast, inverted colours, a code that is too small, or too much text can all cause problems. Use dark on light, keep the quiet margin and test before printing.' },
    ],
    component: lazy(() => import('../tools/QrCodeGenerator')),
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce JPG, PNG and WebP file size in your browser. Nothing is uploaded.',
    categories: ['image-tools'],
    icon: ImageDown,
    keywords: ['image', 'compress', 'compressor', 'reduce size', 'photo', 'jpg', 'jpeg', 'png', 'webp', 'optimize'],
    popular: true,
    localOnly: true,
    seoTitle: 'Image Compressor – Reduce JPG, PNG & WebP Size Online',
    seoDescription: 'Free image compressor that runs in your browser. Reduce JPG, PNG and WebP file size, compare before and after, and download the result.',
    intro: 'Smaller images load faster and are easier to email or upload. This tool re-encodes your image in the browser at the quality you choose and shows the file size before and after. Your image is not uploaded by this tool.',
    howTo: [
      'Choose an image (JPG, PNG or WebP, up to 25 MB).',
      'Set the quality and output format, and compare the sizes shown.',
      'Download the compressed image.',
    ],
    example: 'A 3.2 MB phone photo re-encoded as JPEG at quality 75 is often well under 1 MB with little visible difference.',
    faqs: [
      { q: 'Is my image uploaded to a server?', a: 'No. Compression uses your browser’s built-in image tools and the file stays on your device.' },
      { q: 'Why is my PNG not getting smaller?', a: 'PNG is lossless, so the quality setting does not apply. Choose WebP or JPEG for bigger savings. JPEG has no transparency, so transparent areas become white.' },
      { q: 'What if the result is larger than the original?', a: 'Already-optimized files can grow when re-encoded. Lower the quality, change the format, or keep the original.' },
    ],
    component: lazy(() => import('../tools/ImageCompressor')),
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to exact dimensions or a percentage, right in your browser.',
    categories: ['image-tools'],
    icon: Scaling,
    keywords: ['image', 'resize', 'resizer', 'dimensions', 'width', 'height', 'scale', 'photo', 'pixels'],
    localOnly: true,
    seoTitle: 'Image Resizer – Resize JPG, PNG & WebP by Pixels or Percent',
    seoDescription: 'Free image resizer that runs in your browser. Set exact width and height or scale by percentage, keep the aspect ratio and download the result.',
    intro: 'Set a new width and height in pixels, or scale by a percentage. The aspect ratio can be locked so the picture is not stretched. Everything happens in your browser and the file is not uploaded.',
    howTo: [
      'Choose an image (JPG, PNG or WebP, up to 25 MB).',
      'Enter a width or height, or tap a percentage. Keep “Lock aspect ratio” on to avoid distortion.',
      'Pick a format, check the preview and download.',
    ],
    example: 'A 4000 × 3000 photo scaled to 25% becomes 1000 × 750, which is a good size for a web page.',
    faqs: [
      { q: 'Will enlarging an image make it sharper?', a: 'No. Enlarging cannot add detail and can look soft. Resizing down usually looks best.' },
      { q: 'What are the size limits?', a: 'Input files up to 25 MB, output up to 10,000 px per side and about 50 megapixels in total.' },
      { q: 'Is my image uploaded?', a: 'No. Resizing uses your browser and the file stays on your device.' },
    ],
    component: lazy(() => import('../tools/ImageResizer')),
  },
];

export const getToolBySlug = (slug?: string) => tools.find((t) => t.slug === slug);
export const popularTools = () => tools.filter((t) => t.popular);
export const toolsInCategory = (id: CategoryId) => tools.filter((t) => t.categories.includes(id));

export function getRelatedTools(tool: ToolMeta, n = 3): ToolMeta[] {
  const same = tools.filter((t) => t.slug !== tool.slug && t.categories.some((c) => tool.categories.includes(c)));
  const rest = tools.filter((t) => t.slug !== tool.slug && !same.includes(t));
  return [...same, ...rest].slice(0, n);
}

/** Client-side search over name, keywords, category and description. */
export function searchTools(query: string): ToolMeta[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return tools;
  return tools
    .map((t) => {
      const name = t.name.toLowerCase();
      const kw = t.keywords.join(' ').toLowerCase();
      const desc = t.description.toLowerCase();
      const cats = t.categories.map((c) => getCategory(c).name.toLowerCase()).join(' ');
      let score = 0;
      for (const term of terms) {
        let s = 0;
        if (name.includes(term)) s += 10;
        if (kw.includes(term)) s += 6;
        if (cats.includes(term)) s += 3;
        if (desc.includes(term)) s += 1;
        if (!s) return { t, score: 0 };
        score += s;
      }
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.t);
}
