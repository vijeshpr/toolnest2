import { useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw, Ruler } from 'lucide-react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input, Select } from '../components/ui/Input';
import { ResultCard } from '../components/ui/ResultCard';
import { parseNum } from '../lib/utils';

interface Unit { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }
interface Cat { label: string; allowNegative?: boolean; units: Unit[] }

const lin = (id: string, label: string, f: number): Unit => ({ id, label, toBase: (v) => v * f, fromBase: (v) => v / f });

const CATS: Record<string, Cat> = {
  length: { label: 'Length', units: [lin('mm', 'Millimetre (mm)', 0.001), lin('cm', 'Centimetre (cm)', 0.01), lin('m', 'Metre (m)', 1), lin('km', 'Kilometre (km)', 1000), lin('in', 'Inch (in)', 0.0254), lin('ft', 'Foot (ft)', 0.3048), lin('yd', 'Yard (yd)', 0.9144), lin('mi', 'Mile (mi)', 1609.344), lin('nmi', 'Nautical mile', 1852)] },
  mass: { label: 'Weight / mass', units: [lin('mg', 'Milligram (mg)', 1e-6), lin('g', 'Gram (g)', 0.001), lin('kg', 'Kilogram (kg)', 1), lin('t', 'Tonne (t)', 1000), lin('oz', 'Ounce (oz)', 0.028349523125), lin('lb', 'Pound (lb)', 0.45359237), lin('st', 'Stone (st)', 6.35029318)] },
  temperature: {
    label: 'Temperature', allowNegative: true,
    units: [
      { id: 'c', label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', label: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  area: { label: 'Area', units: [lin('mm2', 'Square millimetre', 1e-6), lin('cm2', 'Square centimetre', 1e-4), lin('m2', 'Square metre', 1), lin('ha', 'Hectare (ha)', 1e4), lin('km2', 'Square kilometre', 1e6), lin('in2', 'Square inch', 0.00064516), lin('ft2', 'Square foot', 0.09290304), lin('yd2', 'Square yard', 0.83612736), lin('ac', 'Acre', 4046.8564224), lin('mi2', 'Square mile', 2589988.110336)] },
  volume: { label: 'Volume', units: [lin('ml', 'Millilitre (mL)', 0.001), lin('l', 'Litre (L)', 1), lin('m3', 'Cubic metre (m³)', 1000), lin('tsp', 'Teaspoon (US)', 0.00492892159375), lin('tbsp', 'Tablespoon (US)', 0.01478676478125), lin('floz', 'Fluid ounce (US)', 0.0295735295625), lin('cup', 'Cup (US)', 0.2365882365), lin('pt', 'Pint (US)', 0.473176473), lin('qt', 'Quart (US)', 0.946352946), lin('gal', 'Gallon (US)', 3.785411784)] },
  speed: { label: 'Speed', units: [lin('ms', 'Metre/second (m/s)', 1), lin('kmh', 'Kilometre/hour (km/h)', 1 / 3.6), lin('mph', 'Mile/hour (mph)', 0.44704), lin('kn', 'Knot (kn)', 1852 / 3600), lin('fps', 'Foot/second (ft/s)', 0.3048)] },
  time: { label: 'Time', units: [lin('ms', 'Millisecond', 0.001), lin('s', 'Second', 1), lin('min', 'Minute', 60), lin('h', 'Hour', 3600), lin('d', 'Day', 86400), lin('w', 'Week', 604800), lin('y', 'Year (365.25 days)', 31557600)] },
  data: { label: 'Digital storage', units: [lin('bit', 'Bit', 0.125), lin('B', 'Byte (B)', 1), lin('KB', 'Kilobyte (KB, 1000 B)', 1e3), lin('MB', 'Megabyte (MB)', 1e6), lin('GB', 'Gigabyte (GB)', 1e9), lin('TB', 'Terabyte (TB)', 1e12), lin('KiB', 'Kibibyte (KiB, 1024 B)', 1024), lin('MiB', 'Mebibyte (MiB)', 1024 ** 2), lin('GiB', 'Gibibyte (GiB)', 1024 ** 3)] },
};

function fmt(n: number): string {
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-7) return n.toExponential(6);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 }).format(n);
}

export default function UnitConverter() {
  const [cat, setCat] = useState('length');
  const [from, setFrom] = useState(CATS.length.units[2].id);
  const [to, setTo] = useState(CATS.length.units[3].id);
  const [value, setValue] = useState('');
  const c = CATS[cat];

  function changeCat(k: string) {
    setCat(k);
    setFrom(CATS[k].units[0].id);
    setTo(CATS[k].units[1].id);
  }

  const out = useMemo(() => {
    if (value.trim() === '') return { error: null, res: null };
    const n = parseNum(value);
    if (n === null) return { error: 'Enter a valid number.', res: null };
    if (Math.abs(n) > 1e15) return { error: 'Value is too large.', res: null };
    if (!c.allowNegative && n < 0) return { error: 'Enter a value of zero or more.', res: null };
    const fu = c.units.find((u) => u.id === from), tu = c.units.find((u) => u.id === to);
    if (!fu || !tu) return { error: null, res: null };
    const base = fu.toBase(n);
    if (cat === 'temperature' && base < -273.15 - 1e-9) return { error: 'That is below absolute zero.', res: null };
    return { error: null, res: { main: tu.fromBase(base), all: c.units.map((u) => ({ u, v: u.fromBase(base) })), fu, tu, n } };
  }, [value, from, to, cat, c]);

  return (
    <ToolLayout
      inputs={
        <>
          <Select label="Category" value={cat} onChange={(e) => changeCat(e.target.value)}>
            {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </Select>
          <Input label="Value" inputMode="decimal" placeholder="e.g. 10" value={value} onChange={(e) => setValue(e.target.value)} error={out.error} />
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <Select label="From" value={from} onChange={(e) => setFrom(e.target.value)}>{c.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}</Select>
            <button type="button" aria-label="Swap units" onClick={() => { setFrom(to); setTo(from); }} className="mb-0.5 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Select label="To" value={to} onChange={(e) => setTo(e.target.value)}>{c.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}</Select>
          </div>
          <Button variant="secondary" onClick={() => { setValue(''); changeCat('length'); setFrom('m'); setTo('km'); }}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</Button>
        </>
      }
      results={
        out.res ? (
          <>
            <ResultCard highlight label={`${fmt(out.res.n)} ${out.res.fu.label} =`} value={`${fmt(out.res.main)} ${out.res.tu.label}`} />
            <div>
              <p className="mb-2 text-sm font-medium text-ink-900 dark:text-white">Same value in every {c.label.toLowerCase()} unit</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {out.res.all.map(({ u, v }) => (
                  <li key={u.id} className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
                    <span className="block text-slate-600 dark:text-slate-400">{u.label}</span>
                    <span className="block break-words font-medium text-ink-900 dark:text-white">{fmt(v)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <EmptyState icon={Ruler} title="Enter a value" text="Choose a category and units, then type a number to convert." />
        )
      }
    />
  );
}
