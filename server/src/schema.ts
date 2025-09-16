export const typeDefs = /* GraphQL */ `
  enum Activity {
    SKIING
    SURFING
    OUTDOOR_SIGHTSEEING
    INDOOR_SIGHTSEEING
  }
  type DayScore {
    date: String!
    score: Int!
    reason: String!
  }
  type ActivityRanking {
    activity: Activity!
    score: Int!
    reason: String!
    days: [DayScore!]!
  }
  type CacheMeta {
    hit: Boolean!
    ttlSeconds: Int!
  }
  type CityRanking {
    city: String!
    country: String
    latitude: Float!
    longitude: Float!
    activities: [ActivityRanking!]!
    generatedAt: String!
    cache: CacheMeta!
  }
  type Query {
    cityRanking(city: String!): CityRanking!
  }
`;
