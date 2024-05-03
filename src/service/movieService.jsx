import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ENDPOINT_SEARCH,
  ENDPOINT_DISCOVER,
  ENDPOINT,
  API_KEY,
} from "../constants";

export const movieDbApi = createApi({
  reducerPath: "movieDbApi",
  baseQuery: fetchBaseQuery({ baseUrl: ENDPOINT }),
  endpoints: (builder) => ({
    GetMovies: builder.query({
      query: (page) => page,
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.results.push(...newItems.results);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    SearchMovies: builder.query({
      query: ({ page, query }) =>
        `/search/movie?api_key=${API_KEY}&sort_by=vote_count.desc&query=${query}&page=${page}`,
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.results.push(...newItems.results);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetMoviesQuery, useSearchMoviesQuery } = movieDbApi;
