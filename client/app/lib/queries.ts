import { gql } from '@apollo/client';

export const CITY_RANKING_QUERY = gql`
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
