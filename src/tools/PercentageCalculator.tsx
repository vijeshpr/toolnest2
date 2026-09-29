import { useMemo, useState } from 'react';
import { Percent, RotateCcw } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input, Select } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { formatNumber, parseNum } from '../lib/utils';

type Mode = 'of' | 'whatPercent' | 'change' | 'adjust';

const MODES: Record<Mode, { label: string; a: string; b: string }> = {
  of: { label: 'What is X% of Y?', a: 'Percentage (X)', b: 'Number (Y)' },
  whatPercent: { label: 'X is what percent of Y?', a: 'Value (X)', b: 'Total (Y)' },
  change: { label: 'Percentage change from X to Y', a: 'From (X)', b: 'To (Y)' },
  adjust: { label: 'Increase or decrease a number', a: 'Percentage', b: 'Number' },
};
const LIMIT = 1e12;

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [dir, setDir] = useState<'up' | 'down'>('down');

  const out = useMemo(() => {
    const errs: { a?: string; b?: string } = {};
    const x = parseNum(a), y = parseNum(b);
    if (a.trim() !== '') {
      if (x === null) errs.a = 'Enter a valid number.';
      else if (Math.abs(x) > LIMIT) errs.a = 'Number is too large.';
    }
    if (b.trim() !== '') {
      if (y === null) errs.b = 'Enter a valid number.';
      else if (Math.abs(y) > LIMIT) errs.b = 'Number is too large.';
      else if (mode === 'whatPercent' && y === 0) errs.b = 'The total cannot be zero.';
      else if (mode === 'change' && parseNum(a) === 0) errs.a = 'The starting value cannot be zero.';
    }
    if (mode === 'change' && x === 0 && !errs.a) errs.a = 'The starting value cannot be zero.';
    if (Object.keys(errs).length || x === null || y === null) return { errs, res: null };

    switch (mode) {
      case 'of': return { errs, res: { value: formatNumber((x * y) / 100, 6), text: `${formatNumber(x, 6)}% of ${formatNumber(y, 6)}`, formula: `${x} ÷ 100 × ${y}` } };
      case 'whatPercent': return { errs, res: { value: `${formatNumber((x / y) * 100, 6)}%`, text: `${formatNumber(x, 6)} as a share of ${formatNumber(y, 6)}`, formula: `${x} ÷ ${y} × 100` } };
      case 'change': {
        const c = ((y - x) / Math.abs(x)) * 100;
        return { errs, res: { value: `${c > 0 ? '+' : ''}${formatNumber(c, 6)}%`, text: c === 0 ? 'No change' : c > 0 ? 'Increase' : 'Decrease', formula: `(${y} − ${x}) ÷ |${x}| × 100` } };
      }
      case 'adjust': {
        const v = dir === 'up' ? y * (1 + x / 100) : y * (1 - x / 100);
        return { errs, res: { value: formatNumber(v, 6), text: `${formatNumber(y, 6)} ${dir === 'up' ? 'increased' : 'decreased'} by ${formatNumber(x, 6)}%`, formula: `${y} × (1 ${dir === 'up' ? '+' : '−'} ${x} ÷ 100)` } };
      }
    }
  }, [a, b, mode, dir]);

  const m = MODES[mode];
  return (
    <ToolLayout
      inputs={
        <>
          <Select label="What do you want to find?" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            {(Object.keys(MODES) as Mode[]).map((k) => <option key={k} value={k}>{MODES[k].label}</option>)}
          </Select>
          {mode === 'adjust' && (
            <Select label="Direction" value={dir} onChange={(e) => setDir(e.target.value as 'up' | 'down')}>
              <option value="down">Decrease (discount)</option>
              <option value="up">Increase (markup)</option>
            </Select>
          )}
          <Input label={m.a} inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} error={out.errs.a} placeholder="e.g. 15" />
          <Input label={m.b} inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} error={out.errs.b} placeholder="e.g. 200" />
          <Button variant="secondary" onClick={() => { setA(''); setB(''); setMode('of'); setDir('down'); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
        </>
      }
      results={
        out.res ? (
          <>
            <ResultCard highlight label={out.res.text} value={out.res.value} />
            <ResultCard label="Formula used" value={<span className="text-base font-medium">{out.res.formula}</span>} />
          </>
        ) : (
          <EmptyState icon={Percent} title="Enter two numbers" text="The answer appears here as soon as both values are valid." />
        )
      }
    />
  );
}
