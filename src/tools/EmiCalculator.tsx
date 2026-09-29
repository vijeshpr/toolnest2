import { useMemo, useState } from 'react';
import { Landmark, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input, Select } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { formatINR, parseNum } from '../lib/utils';

interface Row { year: number; principal: number; interest: number; balance: number }
interface Errors { amount?: string; rate?: string; tenure?: string }

function compute(amount: string, rate: string, tenure: string, unit: 'years' | 'months') {
  const errors: Errors = {};
  const a = parseNum(amount), r = parseNum(rate), t = parseNum(tenure);

  if (amount.trim() !== '') {
    if (a === null) errors.amount = 'Enter a valid number.';
    else if (a <= 0) errors.amount = 'Loan amount must be greater than zero.';
    else if (a > 1e10) errors.amount = 'Amount is too large. The maximum is 10,00,00,00,000.';
  }
  if (rate.trim() !== '') {
    if (r === null) errors.rate = 'Enter a valid number.';
    else if (r < 0) errors.rate = 'Interest rate cannot be negative.';
    else if (r > 100) errors.rate = 'Interest rate cannot be more than 100%.';
  }
  if (tenure.trim() !== '') {
    if (t === null) errors.tenure = 'Enter a valid number.';
    else if (t <= 0) errors.tenure = 'Tenure must be greater than zero.';
    else {
      const months = unit === 'years' ? t * 12 : t;
      if (Math.round(months) < 1) errors.tenure = 'Tenure must be at least 1 month.';
      else if (months > 600) errors.tenure = 'Tenure cannot be more than 50 years (600 months).';
    }
  }
  if (Object.keys(errors).length || a === null || r === null || t === null) return { errors, result: null };

  const n = Math.round(unit === 'years' ? t * 12 : t);
  const mr = r / 12 / 100;
  const emi = mr === 0 ? a / n : (a * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  const total = emi * n;

  const rows: Row[] = [];
  let bal = a, yr = 1, yi = 0, yp = 0;
  for (let m = 1; m <= n; m++) {
    const int = bal * mr;
    const prin = emi - int;
    bal -= prin;
    yi += int;
    yp += prin;
    if (m % 12 === 0 || m === n) {
      rows.push({ year: yr, principal: yp, interest: yi, balance: Math.max(bal, 0) });
      yr++; yi = 0; yp = 0;
    }
  }
  return { errors, result: { emi, total, interest: total - a, principal: a, rows } };
}

export default function EmiCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [unit, setUnit] = useState<'years' | 'months'>('years');
  const { errors, result } = useMemo(() => compute(amount, rate, tenure, unit), [amount, rate, tenure, unit]);
  const reset = () => { setAmount(''); setRate(''); setTenure(''); setUnit('years'); };

  return (
    <ToolLayout
      inputs={
        <>
          <Input label="Loan amount" leading="₹" inputMode="decimal" placeholder="e.g. 1000000" value={amount} onChange={(e) => setAmount(e.target.value)} error={errors.amount} />
          <Input label="Interest rate (per year)" trailing="%" inputMode="decimal" placeholder="e.g. 9" value={rate} onChange={(e) => setRate(e.target.value)} error={errors.rate} />
          <div className="grid grid-cols-[1fr_auto] items-start gap-3">
            <Input label="Tenure" inputMode="decimal" placeholder={unit === 'years' ? 'e.g. 5' : 'e.g. 60'} value={tenure} onChange={(e) => setTenure(e.target.value)} error={errors.tenure} />
            <div className="w-28"><Select label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as 'years' | 'months')}><option value="years">Years</option><option value="months">Months</option></Select></div>
          </div>
          <Button variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
        </>
      }
      results={
        result ? (
          <>
            <ResultCard highlight label="Monthly EMI" value={formatINR(result.emi)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard label="Total interest" value={formatINR(result.interest)} />
              <ResultCard label="Total payment" value={formatINR(result.total)} />
            </div>
            <div>
              <div className="flex h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" role="img" aria-label={`Principal ${Math.round((result.principal / result.total) * 100)} percent, interest ${Math.round((result.interest / result.total) * 100)} percent`}>
                <div className="bg-brand-600 dark:bg-brand-400" style={{ width: `${(result.principal / result.total) * 100}%` }} />
                <div className="bg-amber-400" style={{ width: `${(result.interest / result.total) * 100}%` }} />
              </div>
              <p className="mt-2 flex flex-wrap gap-x-4 text-sm text-slate-600 dark:text-slate-400">
                <span><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-brand-600 dark:bg-brand-400" aria-hidden="true" />Principal</span>
                <span><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />Interest</span>
              </p>
            </div>
            <details className="rounded-xl border border-slate-200 dark:border-slate-800">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink-900 dark:text-white">Yearly repayment schedule</summary>
              <div className="overflow-x-auto px-2 pb-3">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="text-slate-600 dark:text-slate-400"><tr><th className="p-2 font-medium">Year</th><th className="p-2 font-medium">Principal</th><th className="p-2 font-medium">Interest</th><th className="p-2 font-medium">Balance</th></tr></thead>
                  <tbody>
                    {result.rows.map((r) => (
                      <tr key={r.year} className="border-t border-slate-100 dark:border-slate-800"><td className="p-2">{r.year}</td><td className="p-2">{formatINR(r.principal)}</td><td className="p-2">{formatINR(r.interest)}</td><td className="p-2">{formatINR(r.balance)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            <p className="text-sm text-slate-600 dark:text-slate-400">Estimate using the reducing-balance method. Your lender’s figure may differ slightly.</p>
          </>
        ) : (
          <EmptyState icon={Landmark} title="Enter loan details" text="Add the amount, interest rate and tenure to see your EMI." />
        )
      }
    />
  );
}
