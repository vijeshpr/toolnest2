import { FEATURES } from '../config/site';
import { cn } from '../lib/utils';

interface Props {
  slot: string; // your own name for the placement, e.g. "home-mid", "tool-below-result"
  format?: 'leaderboard' | 'rectangle';
  className?: string;
}

/**
 * Reserved space for a future ad. No fake ads are ever rendered.
 * - FEATURES.ads = false: renders nothing in production (a dashed outline in `npm run dev` only).
 * - FEATURES.ads = true: renders a labelled, fixed-height container so ads can't cause layout shift.
 *   Put your ad network's code where marked below.
 */
export function AdPlaceholder({ slot, format = 'leaderboard', className }: Props) {
  if (!FEATURES.ads && !import.meta.env.DEV) return null;
  const size = format === 'leaderboard' ? 'min-h-[100px]' : 'min-h-[250px]';

  if (!FEATURES.ads) {
    return (
      <div aria-hidden="true" className={cn('my-8 flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400 dark:border-slate-700', size, className)}>
        Ad slot: {slot} (visible in development only)
      </div>
    );
  }
  return (
    <aside aria-label="Advertisement" className={cn('my-8', className)}>
      <p className="mb-1 text-center text-xs text-slate-500">Advertisement</p>
      <div data-ad-slot={slot} className={cn('flex w-full items-center justify-center overflow-hidden', size)}>
        {/* TODO: mount your ad network's tag/component for this slot here. */}
      </div>
    </aside>
  );
}
