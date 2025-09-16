'use client';
import type { ActivityRanking } from '@activity/shared';

const pretty = (a: string) =>
  a
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-green-600 dark:text-green-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getScoreBgColor = (score: number) => {
  if (score >= 70) return 'bg-green-50 dark:bg-green-900/20';
  if (score >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20';
  return 'bg-red-50 dark:bg-red-900/20';
};

export function ActivityCard({ item }: { item: ActivityRanking }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white dark:bg-neutral-900">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{pretty(item.activity)}</h3>
        <span
          className={`tabular-nums text-xl font-bold ${getScoreColor(
            item.score
          )}`}
        >
          {item.score}
        </span>
      </div>
      <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
        {item.reason}
      </p>
      <div className="grid grid-cols-7 gap-2">
        {item.days.map((d) => (
          <div key={d.date} className="text-center">
            <div className="text-xs text-neutral-500">{d.date.slice(5)}</div>
            <div
              className={`tabular-nums font-medium p-1 rounded ${getScoreBgColor(
                d.score
              )} ${getScoreColor(d.score)}`}
            >
              {d.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
