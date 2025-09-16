'use client';

import { useState, useEffect } from 'react';
import { ApolloProvider, useLazyQuery } from '@apollo/client';
import { client } from './lib/apollo';
import { ActivityCard } from './components/ActivityCard';
import { CITY_RANKING_QUERY } from './lib/queries';
import type { CityRanking } from '@activity/shared';

function HomeInner() {
  const [city, setCity] = useState('London');
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [run, { data, loading, error }] = useLazyQuery(CITY_RANKING_QUERY);

  // Load recent cities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentCities');
    if (saved) {
      setRecentCities(JSON.parse(saved));
    }
  }, []);

  const isValidCity = city.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCity) return;

    run({ variables: { city: city.trim() } });

    // Add to recent cities
    const trimmedCity = city.trim();
    if (!recentCities.includes(trimmedCity)) {
      const newRecent = [trimmedCity, ...recentCities.slice(0, 4)]; // Keep last 5
      setRecentCities(newRecent);
      localStorage.setItem('recentCities', JSON.stringify(newRecent));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submit(e);
    }
  };

  const result: CityRanking | undefined = data?.cityRanking;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Activity Ranker</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Enter a city. Get a ranked view for the next 7 days.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-3">
        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="City or town"
            className="flex-1 rounded-xl border bg-white px-3 py-2 dark:bg-neutral-900"
          />
          <button
            disabled={!isValidCity || loading}
            className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Check'}
          </button>
        </div>

        {recentCities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Recent:</span>
            {recentCities.map((recentCity) => (
              <button
                key={recentCity}
                onClick={() => setCity(recentCity)}
                className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-2 py-1 rounded"
              >
                {recentCity}
              </button>
            ))}
          </div>
        )}
      </form>

      {loading && (
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
          Error: {error.message}
        </div>
      )}

      {result && (
        <section className="space-y-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {result.city}
            {result.country ? `, ${result.country}` : ''} • cache{' '}
            {result.cache.hit ? 'hit' : 'miss'} • TTL {result.cache.ttlSeconds}s
          </div>
          <div className="grid gap-4">
            {[...result.activities]
              .sort((a, b) => b.score - a.score)
              .map((a: any) => (
                <ActivityCard key={a.activity} item={a} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ApolloProvider client={client}>
      <HomeInner />
    </ApolloProvider>
  );
}
