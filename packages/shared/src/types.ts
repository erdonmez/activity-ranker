export type Activity =
  | 'SKIING'
  | 'SURFING'
  | 'OUTDOOR_SIGHTSEEING'
  | 'INDOOR_SIGHTSEEING';

export interface DayWeather {
  date: string;
  tMax: number | null;
  tMin: number | null;
  precipProb: number | null;
  windMax: number | null;
  snowfall: number | null;
  waveHeight: number | null;
}

export interface DayScore {
  date: string;
  score: number;
  reason: string;
}

export interface ActivityRanking {
  activity: Activity;
  score: number;
  reason: string;
  days: DayScore[];
}

export interface CityRanking {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  activities: ActivityRanking[];
  generatedAt: string;
  cache: { hit: boolean; ttlSeconds: number };
}
