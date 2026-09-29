import { useMemo, useState } from 'react';
import { Check, Copy, CaseSensitive, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Textarea } from '../components/ui/Input';
import { cn } from '../lib/utils';

const MAX_CHARS = 200_000;

const words = (s: string) => s.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2').match(/[\p{L}\p{N}]+/gu) ?? [];
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const MODES: { id: string; label: string; fn: (s: string) => string }[] = [
  { id: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { id: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
  { id: 'title', label: 'Title Case', fn: (s) => s.toLowerCase().replace(/(^|[\s\-_/(])(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase()) },
  { id: 'sentence', label: 'Sentence case', fn: (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase()) },
  { id: 'camel', label: 'camelCase', fn: (s) => words(s).map((w, i) => (i ? cap(w) : w.toLowerCase())).join('') },
  { id: 'pascal', label: 'PascalCase', fn: (s) => words(s).map(cap).join('') },
  { id: 'snake', label: 'snake_case', fn: (s) => words(s).map((w) => w.toLowerCase()).join('_') },
  { id: 'kebab', label: 'kebab-case', fn: (s) => words(s).map((w) => w.toLowerCase()).join('-') },
  { id: 'constant', label: 'CONSTANT_CASE', fn: (s) => words(s).map((w) => w.toUpperCase()).join('_') },
  { id: 'alt', label: 'aLtErNaTiNg', fn: (s) => [...s.toLowerCase()].map((ch, i) => (i % 2 ? ch.toUpperCase() : ch)).join('') },
];

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('title');
  const [copied, setCopied] = useState<'yes' | 'no' | 'error'>('no');
  const output = useMemo(() => MODES.find((m) => m.id === mode)!.fn(text), [text, mode]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied('yes');
      setTimeout(() => setCopied('no'), 1800);
    } catch {
      setCopied('error');
    }
  }

  return (
    <ToolLayout
      inputs={
        <>
          <Textarea label="Your text" value={text} maxLength={MAX_CHARS} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here…" />
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">Convert to</legend>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}
                  className={cn('h-10 rounded-full border px-3.5 text-sm font-medium', mode === m.id ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-ink-950' : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800')}>
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>
          <Button variant="secondary" onClick={() => { setText(''); setMode('title'); setCopied('no'); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
        </>
      }
      results={
        text ? (
          <>
            <Textarea label="Result" readOnly value={output} onFocus={(e) => e.currentTarget.select()} />
            <Button onClick={copy}>{copied === 'yes' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{copied === 'yes' ? 'Copied' : 'Copy result'}</Button>
            {copied === 'error' && <Alert tone="warning">Your browser blocked copying. Select the text above and copy it manually.</Alert>}
          </>
        ) : (
          <EmptyState icon={CaseSensitive} title="Nothing to convert yet" text="Type or paste text, then choose a case style." />
        )
      }
    />
  );
}
