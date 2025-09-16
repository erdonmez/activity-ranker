import { ActivityRanking, DayScore, DayWeather } from './types';

export function buildActivityRankings(days: DayWeather[]): ActivityRanking[] {
  const dates = (
    days?.length
      ? days.map((d) => d.date)
      : Array.from({ length: 7 }, (_, i) => `DAY_${i + 1}`)
  ).slice(0, 7);

  const stub = (score: number, reason: string): DayScore[] =>
    dates.map((date) => ({ date, score, reason }));

  return [
    {
      activity: 'SKIING',
      score: 30,
      reason: 'hardcoded',
      days: stub(25, 'hardcoded'),
    },
    {
      activity: 'SURFING',
      score: 55,
      reason: 'hardcoded',
      days: stub(50, 'hardcoded'),
    },
    {
      activity: 'OUTDOOR_SIGHTSEEING',
      score: 70,
      reason: 'hardcoded',
      days: stub(70, 'hardcoded'),
    },
    {
      activity: 'INDOOR_SIGHTSEEING',
      score: 60,
      reason: 'hardcoded',
      days: stub(60, 'hardcoded'),
    },
  ];
}
