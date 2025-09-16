'use client';
import type { ActivityRanking } from '@activity/shared';

const pretty = (a: string) =>
  a
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function ActivityCard({ item }: { item: ActivityRanking }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white dark:bg-neutral-900">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{pretty(item.activity)}</h3>
        <span className="tabular-nums text-xl font-bold">{item.score}</span>
      </div>
      <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
        {item.reason}
      </p>
      <div className="grid grid-cols-7 gap-2">
        {item.days.map((d) => (
          <div key={d.date} className="text-center">
            <div className="text-xs text-neutral-500">{d.date.slice(5)}</div>
            <div className="tabular-nums font-medium">{d.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
