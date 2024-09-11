import { gql } from "@apollo/client";

export const REACTIONS = gql`
query Reactions($afterCursor: String!) {
  allFilms(first: 2 after: $afterCursor) {
    films {
      created
      director
      title
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
`;
