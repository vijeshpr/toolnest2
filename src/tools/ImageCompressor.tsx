import { useEffect, useState } from 'react';
import { Download, ImageDown, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { FileDrop } from '../components/FileDrop';
import { Alert } from '../components/ui/Alert';
import { Button, buttonClasses } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { baseName, extFor, loadImage, MAX_PIXELS, renderToBlob, validateImageFile, type LoadedImage } from '../lib/image';
import { formatBytes } from '../lib/utils';

interface Result { blob: Blob; url: string }

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<LoadedImage | null>(null);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (src) URL.revokeObjectURL(src.url); }, [src]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  async function onFile(f: File) {
    setError(null);
    setResult(null);
    const problem = await validateImageFile(f);
    if (problem) { setError(problem); return; }
    try {
      const loaded = await loadImage(f);
      if (loaded.width * loaded.height > MAX_PIXELS) {
        URL.revokeObjectURL(loaded.url);
        setError('This image is too large to process in the browser (over 50 megapixels).');
        return;
      }
      setFile(f);
      setSrc(loaded);
      setFormat(f.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The image could not be read.');
    }
  }

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    setBusy(true);
    const timer = setTimeout(async () => {
      try {
        const blob = await renderToBlob(src.img, src.width, src.height, format, quality / 100);
        if (cancelled) return;
        setResult({ blob, url: URL.createObjectURL(blob) });
        setError(null);
      } catch (e) {
        if (!cancelled) { setResult(null); setError(e instanceof Error ? e.message : 'Compression failed.'); }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [src, quality, format]);

  const reset = () => { setFile(null); setSrc(null); setResult(null); setError(null); setQuality(75); };
  const saved = file && result ? Math.round((1 - result.blob.size / file.size) * 100) : 0;

  return (
    <ToolLayout
      inputs={
        <>
          {!file ? (
            <FileDrop onFile={onFile} />
          ) : (
            <>
              <p className="break-all text-sm text-slate-600 dark:text-slate-400"><span className="font-medium text-ink-900 dark:text-white">{file.name}</span> ({src?.width} × {src?.height} px)</p>
              <div>
                <label htmlFor="quality" className="mb-1.5 flex justify-between text-sm font-medium text-slate-800 dark:text-slate-200"><span>Quality</span><span>{quality}%</span></label>
                <input id="quality" type="range" min={10} max={100} step={1} value={quality} disabled={format === 'image/png'} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-brand-600" />
                {format === 'image/png' && <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">PNG is lossless, so quality does not apply. Choose WebP or JPEG for smaller files.</p>}
              </div>
              <Select label="Output format" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="image/jpeg">JPEG (transparent areas become white)</option>
                <option value="image/webp">WebP (small, keeps transparency)</option>
                <option value="image/png">PNG (lossless)</option>
              </Select>
              <Button variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
            </>
          )}
          {error && <Alert tone="error">{error}</Alert>}
        </>
      }
      results={
        file && result ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Original size" value={formatBytes(file.size)} />
              <ResultCard highlight label="Compressed size" value={formatBytes(result.blob.size)} hint={saved > 0 ? `${saved}% smaller` : undefined} />
            </div>
            {saved <= 0 && <Alert tone="warning">The result is not smaller than the original. Lower the quality, switch to WebP, or keep the original file.</Alert>}
            <img src={result.url} alt="Preview of the compressed image" className="max-h-72 w-auto max-w-full rounded-xl border border-slate-200 dark:border-slate-700" />
            <a className={buttonClasses('primary', 'md')} href={result.url} download={`${baseName(file.name)}-compressed.${extFor(format)}`}><Download className="h-4 w-4" aria-hidden="true" /> Download compressed image</a>
          </>
        ) : busy ? (
          <p role="status" className="py-10 text-center text-slate-600 dark:text-slate-400">Compressing…</p>
        ) : (
          <div className="flex flex-col items-center py-10 text-center text-slate-600 dark:text-slate-400"><ImageDown className="mb-3 h-6 w-6" aria-hidden="true" /><p>Choose an image to see the before and after size.</p></div>
        )
      }
    />
  );
}
