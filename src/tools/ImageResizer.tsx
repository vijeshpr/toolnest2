import { useEffect, useMemo, useState } from 'react';
import { Download, RotateCcw, Scaling } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { FileDrop } from '../components/FileDrop';
import { Alert } from '../components/ui/Alert';
import { Button, buttonClasses } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { baseName, extFor, loadImage, MAX_PIXELS, renderToBlob, validateImageFile, type LoadedImage } from '../lib/image';
import { formatBytes, parseNum } from '../lib/utils';

const MAX_SIDE = 10_000;
interface Result { blob: Blob; url: string }

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<LoadedImage | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (src) URL.revokeObjectURL(src.url); }, [src]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  async function onFile(f: File) {
    setError(null);
    setResult(null);
    const problem = await validateImageFile(f);
    if (problem) { setError(problem); return; }
    try {
      const loaded = await loadImage(f);
      setFile(f);
      setSrc(loaded);
      setWidth(String(loaded.width));
      setHeight(String(loaded.height));
      setFormat(f.type);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The image could not be read.');
    }
  }

  const dims = useMemo(() => {
    const w = parseNum(width), h = parseNum(height);
    const errs: { w?: string; h?: string } = {};
    if (width.trim() !== '' && (w === null || !Number.isInteger(w) || w < 1)) errs.w = 'Enter a whole number of 1 or more.';
    else if (w !== null && w > MAX_SIDE) errs.w = `Maximum width is ${MAX_SIDE.toLocaleString()} px.`;
    if (height.trim() !== '' && (h === null || !Number.isInteger(h) || h < 1)) errs.h = 'Enter a whole number of 1 or more.';
    else if (h !== null && h > MAX_SIDE) errs.h = `Maximum height is ${MAX_SIDE.toLocaleString()} px.`;
    if (!errs.w && !errs.h && w && h && w * h > MAX_PIXELS) errs.w = 'The total size is too large (over 50 megapixels).';
    return { w, h, errs, valid: !errs.w && !errs.h && !!w && !!h };
  }, [width, height]);

  function onWidth(v: string) {
    setWidth(v);
    const n = parseNum(v);
    if (lock && src && n !== null && n > 0) setHeight(String(Math.max(1, Math.round((n * src.height) / src.width))));
  }
  function onHeight(v: string) {
    setHeight(v);
    const n = parseNum(v);
    if (lock && src && n !== null && n > 0) setWidth(String(Math.max(1, Math.round((n * src.width) / src.height))));
  }
  function scale(pct: number) {
    if (!src) return;
    setWidth(String(Math.max(1, Math.round((src.width * pct) / 100))));
    setHeight(String(Math.max(1, Math.round((src.height * pct) / 100))));
  }

  useEffect(() => {
    if (!src || !dims.valid || !dims.w || !dims.h) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const blob = await renderToBlob(src.img, dims.w!, dims.h!, format, 0.92);
        if (cancelled) return;
        setResult({ blob, url: URL.createObjectURL(blob) });
        setError(null);
      } catch (e) {
        if (!cancelled) { setResult(null); setError(e instanceof Error ? e.message : 'Resizing failed.'); }
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [src, dims.valid, dims.w, dims.h, format]);

  const reset = () => { setFile(null); setSrc(null); setResult(null); setError(null); setWidth(''); setHeight(''); setLock(true); };
  const enlarging = !!(src && dims.w && dims.h && (dims.w > src.width || dims.h > src.height));

  return (
    <ToolLayout
      inputs={
        <>
          {!file || !src ? (
            <FileDrop onFile={onFile} />
          ) : (
            <>
              <p className="break-all text-sm text-slate-600 dark:text-slate-400"><span className="font-medium text-ink-900 dark:text-white">{file.name}</span>, {src.width} × {src.height} px, {formatBytes(file.size)}</p>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Width" trailing="px" inputMode="numeric" value={width} onChange={(e) => onWidth(e.target.value)} error={dims.errs.w} />
                <Input label="Height" trailing="px" inputMode="numeric" value={height} onChange={(e) => onHeight(e.target.value)} error={dims.errs.h} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Lock aspect ratio
              </label>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Scale presets">
                {[25, 50, 75, 100].map((p) => <Button key={p} size="sm" variant="secondary" onClick={() => scale(p)}>{p}%</Button>)}
              </div>
              <Select label="Output format" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="image/jpeg">JPEG (transparent areas become white)</option>
                <option value="image/png">PNG (lossless)</option>
                <option value="image/webp">WebP</option>
              </Select>
              <Button variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
            </>
          )}
          {error && <Alert tone="error">{error}</Alert>}
        </>
      }
      results={
        file && result && dims.valid ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Original" value={`${src?.width} × ${src?.height} px`} hint={formatBytes(file.size)} />
              <ResultCard highlight label="Resized" value={`${dims.w} × ${dims.h} px`} hint={formatBytes(result.blob.size)} />
            </div>
            {enlarging && <Alert tone="info">Enlarging an image can make it look soft. Resizing down usually gives the best quality.</Alert>}
            <img src={result.url} alt="Preview of the resized image" className="max-h-72 w-auto max-w-full rounded-xl border border-slate-200 dark:border-slate-700" />
            <a className={buttonClasses('primary', 'md')} href={result.url} download={`${baseName(file.name)}-${dims.w}x${dims.h}.${extFor(format)}`}><Download className="h-4 w-4" aria-hidden="true" /> Download resized image</a>
          </>
        ) : (
          <div className="flex flex-col items-center py-10 text-center text-slate-600 dark:text-slate-400"><Scaling className="mb-3 h-6 w-6" aria-hidden="true" /><p>{file ? 'Enter a valid width and height to see the result.' : 'Choose an image to resize.'}</p></div>
        )
      }
    />
  );
}
