import { useMemo, useState } from 'react';
import { Receipt, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { cn, formatINR, parseNum } from '../lib/utils';

type Mode = 'add' | 'remove';
// Common Indian GST slabs. Rates can change: users can type any rate.
const PRESETS = ['3', '5', '18', '40'];

export default function GstCalculator() {
  const [mode, setMode] = useState<Mode>('add');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');

  const { errors, result } = useMemo(() => {
    const errors: { amount?: string; rate?: string } = {};
    const a = parseNum(amount), r = parseNum(rate);
    if (amount.trim() !== '') {
      if (a === null) errors.amount = 'Enter a valid number.';
      else if (a < 0) errors.amount = 'Amount cannot be negative.';
      else if (a > 1e12) errors.amount = 'Amount is too large.';
    }
    if (rate.trim() === '') errors.rate = 'Enter a GST rate.';
    else if (r === null) errors.rate = 'Enter a valid number.';
    else if (r < 0 || r > 100) errors.rate = 'GST rate must be between 0 and 100.';
    if (Object.keys(errors).length || a === null || r === null) return { errors, result: null };
    const base = mode === 'add' ? a : a / (1 + r / 100);
    const gst = mode === 'add' ? (a * r) / 100 : a - base;
    return { errors, result: { base, gst, total: base + gst } };
  }, [amount, rate, mode]);

  return (
    <ToolLayout
      inputs={
        <>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">What does your amount include?</legend>
            <div className="grid grid-cols-2 gap-2">
              {([['add', 'Excludes GST (add GST)'], ['remove', 'Includes GST (remove GST)']] as const).map(([v, label]) => (
                <button key={v} type="button" aria-pressed={mode === v} onClick={() => setMode(v)}
                  className={cn('rounded-xl border px-3 py-2.5 text-sm font-medium', mode === v ? 'border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-400 dark:bg-brand-900/40 dark:text-brand-200' : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800')}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <Input label="Amount" leading="₹" inputMode="decimal" placeholder="e.g. 10000" value={amount} onChange={(e) => setAmount(e.target.value)} error={errors.amount} />
          <Input label="GST rate" trailing="%" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} error={errors.rate} hint="Pick a common rate below or type your own." />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Common GST rates">
            {PRESETS.map((p) => (
              <button key={p} type="button" aria-pressed={rate === p} onClick={() => setRate(p)}
                className={cn('h-9 rounded-full border px-4 text-sm font-medium', rate === p ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-ink-950' : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800')}>
                {p}%
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => { setAmount(''); setRate('18'); setMode('add'); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
        </>
      }
      results={
        result ? (
          <>
            <ResultCard highlight label={mode === 'add' ? 'Total price (with GST)' : 'Base price (without GST)'} value={formatINR(mode === 'add' ? result.total : result.base, 2)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Base price" value={formatINR(result.base, 2)} />
              <ResultCard label="GST amount" value={formatINR(result.gst, 2)} />
              <ResultCard label="Total with GST" value={formatINR(result.total, 2)} />
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
              <p className="font-medium text-ink-900 dark:text-white">How the GST splits</p>
              <dl className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between gap-4"><dt>Within one state: CGST</dt><dd>{formatINR(result.gst / 2, 2)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Within one state: SGST</dt><dd>{formatINR(result.gst / 2, 2)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Between states: IGST</dt><dd>{formatINR(result.gst, 2)}</dd></div>
              </dl>
            </div>
          </>
        ) : (
          <EmptyState icon={Receipt} title="Enter an amount" text="Choose whether the amount includes GST, then enter it with the GST rate." />
        )
      }
    />
  );
}
