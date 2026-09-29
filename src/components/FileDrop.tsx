import { useId, useState } from 'react';
import { Upload } from 'lucide-react';
import { IMAGE_ACCEPT } from '../lib/image';
import { cn } from '../lib/utils';

export function FileDrop({ onFile, disabled }: { onFile: (f: File) => void; disabled?: boolean }) {
  const [over, setOver] = useState(false);
  const id = useId();
  return (
    <label
      htmlFor={id}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f && !disabled) onFile(f);
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 px-4 py-10 text-center transition-colors focus-within:ring-2 focus-within:ring-brand-500 dark:border-slate-700',
        over && 'border-brand-500 bg-brand-50 dark:bg-brand-900/30',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <Upload className="mb-3 h-7 w-7 text-brand-600 dark:text-brand-300" aria-hidden="true" />
      <span className="font-medium text-ink-900 dark:text-white">Choose an image</span>
      <span className="mt-1 text-sm text-slate-600 dark:text-slate-400">or drag and drop it here. JPG, PNG or WebP, up to 25 MB.</span>
      <input
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
    </label>
  );
}
