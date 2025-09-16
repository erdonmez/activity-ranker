# Activity Ranker

Monorepo for a small full-stack app that ranks activities (skiing, surfing, outdoor, indoor) for the next 7 days by city.

Stack: Next.js + Apollo Server + GraphQL + TypeScript.

## Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Or create manually:
   # Client: client/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

   # Server: server/.env
   PORT=4000
   CACHE_TTL_MS=1800000
   ```

3. **Start the development servers:**

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start individually:
   pnpm --filter server dev    # Backend on :4000
   pnpm --filter client dev    # Frontend on :3000
   ```

4. **Open the app:**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000

## Caching

- **Server**: In-memory cache with 30min TTL (configurable via `CACHE_TTL_MS`)
- **Recent searches**: Stored in localStorage for quick access

## Environment Configuration

### Client (.env.local)

- `NEXT_PUBLIC_API_URL` - GraphQL API endpoint (default: http://localhost:4000/graphql)

### Server (.env)

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment mode (development/production)
- `CACHE_TTL_MS` - Cache TTL in milliseconds (default: 1800000 = 30 minutes)
- `OPEN_METEO_BASE_URL` - Open-Meteo API base URL
- `GEOCODING_BASE_URL` - Geocoding API base URL

## Project Structure

```
activity-ranker/
├── client/          # Next.js frontend
├── server/          # Apollo GraphQL server
├── packages/
    └── shared/      # Shared TypeScript types
```
