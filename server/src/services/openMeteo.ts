export type GeoResult = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export async function geocodeCity(name: string): Promise<GeoResult | null> {
  // to be moved to .env
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const json = await res.json();
  const r = json?.results?.[0];
  if (!r) return null;
  return {
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  };
}

export type DailyWeatherRaw = {
  dates: string[];
  tMax: (number | null)[];
  tMin: (number | null)[];
  precipProb: (number | null)[];
  windMax: (number | null)[];
  snowfall: (number | null)[];
};

export async function fetchDailyWeather(
  lat: number,
  lon: number
): Promise<DailyWeatherRaw | null> {
  // to be moved to .env
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set(
    'daily',
    [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'snowfall_sum',
    ].join(',')
  );

  url.searchParams.set('forecast_days', '7');
  url.searchParams.set('timezone', 'auto');

  const res = await fetch(url.toString());

  if (!res.ok) return null;

  const j = await res.json();
  const d = j?.daily;

  if (!d) return null;

  return {
    dates: d.time,
    tMax: d.temperature_2m_max,
    tMin: d.temperature_2m_min,
    precipProb: (d.precipitation_probability_max ?? []).map(
      (p: number | null) => (p == null ? null : p / 100)
    ),
    windMax: d.wind_speed_10m_max,
    snowfall: d.snowfall_sum,
  };
}

export async function fetchMarine(
  lat: number,
  lon: number
): Promise<{ dates: string[]; wave: (number | null)[] } | null> {
  // to be moved to .env
  const url = new URL('https://marine-api.open-meteo.com/v1/marine');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('daily', 'wave_height_max');
  url.searchParams.set('forecast_days', '7');
  url.searchParams.set('timezone', 'auto');

  const res = await fetch(url.toString());

  if (!res.ok) return null;

  const j = await res.json();
  const d = j?.daily;

  if (!d) return null;

  return { dates: d.time, wave: d.wave_height_max };
}
