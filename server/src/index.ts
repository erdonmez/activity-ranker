import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import {
  geocodeCity,
  fetchDailyWeather,
  fetchMarine,
} from './services/openMeteo.js';
import { buildActivityRankings } from '../../packages/shared/dist/scoring.js';
import type {
  CityRanking,
  DayWeather,
} from '../../packages/shared/dist/types.js';

const PORT = Number(process.env.PORT ?? 4000);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS ?? 30 * 60 * 1000);
const NODE_ENV = process.env.NODE_ENV ?? 'development';

console.log(`🚀 Starting server in ${NODE_ENV} mode`);
console.log(`📡 Port: ${PORT}`);
console.log(`⏰ Cache TTL: ${CACHE_TTL_MS}ms`);

const resolvers = {
  Query: {
    cityRanking: async (
      _: unknown,
      args: { city: string }
    ): Promise<CityRanking> => {
      // Always compute fresh for now
      const geo = await geocodeCity(args.city);
      if (!geo) throw new Error('City not found');

      const [weather, marine] = await Promise.all([
        fetchDailyWeather(geo.latitude, geo.longitude),
        fetchMarine(geo.latitude, geo.longitude),
      ]);
      if (!weather) throw new Error('Weather data unavailable');

      const days: DayWeather[] = weather.dates.map((date, i) => ({
        date,
        tMax: weather.tMax[i] ?? null,
        tMin: weather.tMin[i] ?? null,
        precipProb: weather.precipProb[i] ?? null,
        windMax: weather.windMax[i] ?? null,
        snowfall: weather.snowfall[i] ?? null,
        waveHeight: (() => {
          if (!marine) return null;
          const j = marine.dates.indexOf(date);
          return j >= 0 ? marine.wave[j] ?? null : null;
        })(),
      }));

      const activities = buildActivityRankings(days);

      return {
        city: geo.name,
        ...(geo.country && { country: geo.country }),
        latitude: geo.latitude,
        longitude: geo.longitude,
        activities,
        generatedAt: new Date().toISOString(),
        cache: { hit: false, ttlSeconds: Math.floor(CACHE_TTL_MS / 1000) },
      };
    },
  },
};

async function main() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });
  console.log(`GraphQL ready at ${url}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
