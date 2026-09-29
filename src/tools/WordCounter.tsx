import { useMemo, useState } from 'react';
import { AlignLeft, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Textarea } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { formatNumber } from '../lib/utils';

const MAX_CHARS = 500_000;
const STOP = new Set('the and for are but not you all any can had her was one our out has have this that with from they will would there their what about which when your said each were been more than them then into some could other these those its also how who its'.split(' '));

function minutes(words: number, wpm: number): string {
  if (words === 0) return '0 sec';
  const secs = Math.round((words / wpm) * 60);
  if (secs < 60) return `${secs} sec`;
  const m = Math.floor(secs / 60), s = secs % 60;
  return s ? `${m} min ${s} sec` : `${m} min`;
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.match(/\S+/g)?.length ?? 0 : 0;
    const sentences = trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim()).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const counts = new Map<string, number>();
    for (const w of text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []) {
      if (w.length > 2 && !STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {
      words, sentences, paragraphs, top,
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, '').length,
    };
  }, [text]);

  return (
    <ToolLayout
      inputs={
        <>
          <Textarea label="Your text" value={text} maxLength={MAX_CHARS} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here…" className="min-h-[16rem]" hint={`Up to ${formatNumber(MAX_CHARS, 0)} characters.`} />
          <Button variant="secondary" onClick={() => setText('')}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear</Button>
        </>
      }
      results={
        text.trim() ? (
          <>
            <ResultCard highlight label="Words" value={formatNumber(stats.words, 0)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Characters" value={formatNumber(stats.chars, 0)} />
              <ResultCard label="Characters (no spaces)" value={formatNumber(stats.charsNoSpaces, 0)} />
              <ResultCard label="Sentences" value={formatNumber(stats.sentences, 0)} />
              <ResultCard label="Paragraphs" value={formatNumber(stats.paragraphs, 0)} />
              <ResultCard label="Reading time" value={minutes(stats.words, 238)} hint="at 238 words per minute" />
              <ResultCard label="Speaking time" value={minutes(stats.words, 150)} hint="at 150 words per minute" />
            </div>
            {stats.top.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-ink-900 dark:text-white">Most used words</p>
                <ul className="flex flex-wrap gap-2">
                  {stats.top.map(([w, n]) => <li key={w} className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{w} <span className="text-slate-500">×{n}</span></li>)}
                </ul>
              </div>
            )}
          </>
        ) : (
          <EmptyState icon={AlignLeft} title="Nothing to count yet" text="Type or paste some text and the counts appear here." />
        )
      }
    />
  );
}
