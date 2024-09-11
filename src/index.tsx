/*** APP ***/
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import "./index.css";
import { REACTIONS } from "./graphqlQueries";

export const App: React.FunctionComponent = () => {
  const { data, fetchMore } = useQuery(REACTIONS, {variables: {
    afterCursor: ""
  }});

  return (
    <main>
      <h3>Home</h3>
      <div>{JSON.stringify(data)}</div>
      <button disabled={data?.allFilms?.pageInfo?.hasNextPage != true || data?.allFilms?.pageInfo?.endCursor == undefined} onClick={() => fetchMore({variables: {
        afterCursor: data?.allFilms?.pageInfo?.endCursor
      }})}>Next Page</button>
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allFilms: {
          //   keyArgs: [],
          //   merge(existing, incoming, {
          //     args,
          //     readField,
          //   }) {
          //     const merged = existing ? existing.slice(0) : [];
          //     let offset = offsetFromCursor(merged, args!.afterCursor, readField);
          //     // If we couldn't find the cursor, default to appending to
          //     // the end of the list, so we don't lose any data.
          //     if (offset < 0) offset = merged.length;
          //     // Now that we have a reliable offset, the rest of this logic
          //     // is the same as in offsetLimitPagination.
          //     for (let i = 0; i < incoming.length; ++i) {
          //       merged[offset + i] = incoming[i];
          //     }
          //     return merged;
          //   },
          //   // If you always want to return the whole list, you can omit
          // // this read function.
          // read(existing, {
          //   args,
          //   readField,
          // }) {
          //   if (existing) {
          //     let offset = offsetFromCursor(existing, args!.afterCursor, readField);
          //     // If we couldn't find the cursor, default to reading the
          //     // entire list.
          //     if (offset < 0) offset = 0;
          //     return existing.slice(offset, offset +  args!.limit ?? existing.length);
          //   }
          // },
          }
        }
      }
    }

  }),
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
});

function offsetFromCursor(items, cursor, readField) {
  // Search from the back of the list because the cursor we're
  // looking for is typically the ID of the last item.
  for (let i = items.length - 1; i >= 0; --i) {
    const item = items[i];
    // Using readField works for both non-normalized objects
    // (returning item.id) and normalized references (returning
    // the id field from the referenced entity object), so it's
    // a good idea to use readField when you're not sure what
    // kind of elements you're dealing with.
    if (readField("id", item) === cursor) {
      // Add one because the cursor identifies the item just
      // before the first item in the page we care about.
      return i + 1;
    }
  }
  // Report that the cursor could not be found.
  return -1;
}

const container = document.getElementById("root");
console.log('container: ', container);
const root = createRoot(container!);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
