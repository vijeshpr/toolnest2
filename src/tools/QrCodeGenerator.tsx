import { useEffect, useState } from 'react';
import { Download, QrCode, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Alert } from '../components/ui/Alert';
import { Button, buttonClasses } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input, Select, Textarea } from '../components/ui/Input';

const MAX_LEN = 1500;
type Level = 'L' | 'M' | 'Q' | 'H';

interface Out { png: string; svgUrl: string }

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState('512');
  const [level, setLevel] = useState<Level>('M');
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [out, setOut] = useState<Out | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const value = text.trim();
    if (!value) { setOut(null); setError(null); return; }
    if (text.length > MAX_LEN) { setOut(null); setError(`Text is too long (${text.length} characters). The maximum is ${MAX_LEN}.`); return; }
    if (fg.toLowerCase() === bg.toLowerCase()) { setOut(null); setError('The two colours are identical, so the code would not be readable. Choose contrasting colours.'); return; }

    let cancelled = false;
    let svgUrl = '';
    const timer = setTimeout(async () => {
      try {
        // Loaded on demand so the QR library isn't part of the initial bundle.
        const mod = await import('qrcode');
        const QR = (mod as unknown as { default?: typeof mod }).default ?? mod;
        const opts = { errorCorrectionLevel: level, margin: 2, color: { dark: fg, light: bg } };
        const [png, svg] = await Promise.all([
          QR.toDataURL(value, { ...opts, width: Number(size) }),
          QR.toString(value, { ...opts, type: 'svg' }),
        ]);
        if (cancelled) return;
        svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
        setOut((prev) => { if (prev) URL.revokeObjectURL(prev.svgUrl); return { png, svgUrl }; });
        setError(null);
      } catch {
        if (!cancelled) { setOut(null); setError('This text is too long or complex for a QR code at this error-correction level. Shorten it or choose a lower level.'); }
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [text, size, level, fg, bg]);

  useEffect(() => () => { if (out) URL.revokeObjectURL(out.svgUrl); }, [out]);

  return (
    <ToolLayout
      inputs={
        <>
          <Textarea label="Link or text" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" className="min-h-[7rem]" hint={`Up to ${MAX_LEN} characters.`} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="PNG size" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="256">256 px</option><option value="512">512 px</option><option value="1024">1024 px</option><option value="2048">2048 px</option>
            </Select>
            <Select label="Error correction" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
              <option value="L">Low (7%)</option><option value="M">Medium (15%)</option><option value="Q">Quartile (25%)</option><option value="H">High (30%)</option>
            </Select>
            <Input label="Code colour" type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-11 p-1" />
            <Input label="Background colour" type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 p-1" />
          </div>
          <Button variant="secondary" onClick={() => { setText(''); setSize('512'); setLevel('M'); setFg('#000000'); setBg('#ffffff'); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
        </>
      }
      results={
        error ? (
          <Alert tone="error">{error}</Alert>
        ) : out ? (
          <>
            <div className="flex justify-center rounded-xl border border-slate-200 p-4 dark:border-slate-700" style={{ backgroundColor: bg }}>
              <img src={out.png} alt="Generated QR code" width={280} height={280} className="h-auto w-full max-w-[280px]" />
            </div>
            <div className="flex flex-wrap gap-3">
              <a className={buttonClasses('primary', 'md')} href={out.png} download="qr-code.png"><Download className="h-4 w-4" aria-hidden="true" /> Download PNG</a>
              <a className={buttonClasses('secondary', 'md')} href={out.svgUrl} download="qr-code.svg"><Download className="h-4 w-4" aria-hidden="true" /> Download SVG</a>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Test the code with your phone camera before printing or sharing.</p>
          </>
        ) : (
          <EmptyState icon={QrCode} title="Enter a link or text" text="Your QR code appears here and updates as you type." />
        )
      }
    />
  );
}
