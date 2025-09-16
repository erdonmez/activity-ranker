'use client';

import { useState } from 'react';
import { ApolloProvider, gql, useLazyQuery } from '@apollo/client';
import { client } from './lib/apollo';
import { ActivityCard } from './components/ActivityCard';

const QUERY = gql`
  query CityRanking($city: String!) {
    cityRanking(city: $city) {
      city
      country
      latitude
      longitude
      generatedAt
      cache {
        hit
        ttlSeconds
      }
      activities {
        activity
        score
        reason
        days {
          date
          score
          reason
        }
      }
    }
  }
`;

function HomeInner() {
  const [city, setCity] = useState('London');
  const [run, { data, loading, error }] = useLazyQuery(QUERY);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run({ variables: { city } });
  };

  const result = data?.cityRanking;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Activity Ranker</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Enter a city. Get a ranked view for the next 7 days.
        </p>
      </header>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City or town"
          className="flex-1 rounded-xl border bg-white px-3 py-2 dark:bg-neutral-900"
        />
        <button className="rounded-xl bg-black px-4 py-2 text-white">
          Check
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}

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
