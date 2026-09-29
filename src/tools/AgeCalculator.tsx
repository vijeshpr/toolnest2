import { useMemo, useState } from 'react';
import { CalendarDays, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { formatNumber, parseDateStr, todayStr } from '../lib/utils';

type Out =
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; y: number; m: number; d: number; days: number; nextIn: number; nextDay: string; bornDay: string };

const DAY = 86_400_000;

function compute(dob: string, at: string): Out {
  if (!dob) return { kind: 'empty' };
  const from = parseDateStr(dob);
  const to = parseDateStr(at);
  if (!from) return { kind: 'error', message: 'Enter a valid date of birth.' };
  if (!to) return { kind: 'error', message: 'Enter a valid “Age at” date.' };
  if (from.getFullYear() < 1900) return { kind: 'error', message: 'Please enter a year of 1900 or later.' };
  if (from > to) return { kind: 'error', message: 'The date of birth must be on or before the “Age at” date.' };

  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m--;
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  const days = Math.round((to.getTime() - from.getTime()) / DAY);
  let next = new Date(to.getFullYear(), from.getMonth(), from.getDate());
  if (next < to) next = new Date(to.getFullYear() + 1, from.getMonth(), from.getDate());
  const nextIn = Math.round((next.getTime() - to.getTime()) / DAY);
  return {
    kind: 'ok', y, m, d, days, nextIn,
    nextDay: next.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    bornDay: from.toLocaleDateString(undefined, { weekday: 'long' }),
  };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [at, setAt] = useState(todayStr());
  const out = useMemo(() => compute(dob, at), [dob, at]);

  return (
    <ToolLayout
      inputs={
        <>
          <Input label="Date of birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={at || undefined} error={out.kind === 'error' ? out.message : null} />
          <Input label="Age at" type="date" value={at} onChange={(e) => setAt(e.target.value)} hint="Defaults to today." />
          <Button variant="secondary" onClick={() => { setDob(''); setAt(todayStr()); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
        </>
      }
      results={
        out.kind === 'ok' ? (
          <>
            <ResultCard highlight label="Your age" value={`${out.y} years, ${out.m} months, ${out.d} days`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Total months" value={formatNumber(out.y * 12 + out.m, 0)} />
              <ResultCard label="Total weeks" value={formatNumber(Math.floor(out.days / 7), 0)} />
              <ResultCard label="Total days" value={formatNumber(out.days, 0)} />
              <ResultCard label="Born on a" value={out.bornDay} />
            </div>
            <ResultCard label="Next birthday" value={out.nextIn === 0 ? 'Today' : `In ${formatNumber(out.nextIn, 0)} days`} hint={out.nextDay} />
          </>
        ) : out.kind === 'error' ? (
          <Alert tone="error">{out.message}</Alert>
        ) : (
          <EmptyState icon={CalendarDays} title="Enter a date of birth" text="Your age appears here as soon as you pick a date." />
        )
      }
    />
  );
}
