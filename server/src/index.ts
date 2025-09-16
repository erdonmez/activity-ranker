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
import { CacheManager } from './lib/cache.js';
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

// Initialize cache manager
const cache = new CacheManager(CACHE_TTL_MS);

const resolvers = {
  Query: {
    cityRanking: async (
      _: unknown,
      args: { city: string }
    ): Promise<CityRanking> => {
      // Check cache first
      const cached = cache.get(args.city);

      if (cached) {
        console.log(`Cache hit for: ${args.city}`);
        return cached;
      }

      console.log(`Cache miss for: ${args.city}, fetching fresh data...`);

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

      const result: CityRanking = {
        city: geo.name,
        ...(geo.country && { country: geo.country }),
        latitude: geo.latitude,
        longitude: geo.longitude,
        activities,
        generatedAt: new Date().toISOString(),
        cache: { hit: false, ttlSeconds: Math.floor(CACHE_TTL_MS / 1000) },
      };

      // Cache the result
      cache.set(args.city, result);
      console.log(`Cached data for: ${args.city}`);

      return result;
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
