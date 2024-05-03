import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, createSearchParams } from "react-router-dom";

/**
 * ? Local & Shared Imports
 */

import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from "../constants";

import { fetchMovies } from "../data/moviesSlice";
// import { hasNext, page } from "../data/selectors";

/**
 *
 * @returns  {fetchMoviesWithQuery, searchMovies, intersectionTargetRef }
 *  @function fetchMoviesWithQuery
 *  @function searchMovies
 */

export const useFetchMovies = () => {
  const dispatch = useDispatch();
  //   const hasNextPage = useSelector(hasNext);
  const hasNextPage = false;
  //   const pageCount = useSelector(page);
  const pageCount = 1;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const fetchMoviesWithQuery = useCallback(
    (query = "", page = 1) => {
      const params = {
        query,
        page,
      };
      const queryParams = new URLSearchParams(params);

      const apiURL = query !== "" ? ENDPOINT_SEARCH : ENDPOINT_DISCOVER;
      setSearchParams(
        query !== "" ? createSearchParams({ search: query }) : ""
      );

      const fetchURL = `${apiURL}&${queryParams.toString()}`;

      dispatch(fetchMovies(fetchURL));
    },
    [dispatch, setSearchParams]
  );

  const searchMovies = useCallback(
    (query) => {
      debounce(fetchMoviesWithQuery(query), 350);
    },
    [fetchMoviesWithQuery]
  );

  const observerRef = useRef(null);
  const intersectionTargetRef = useRef(null);

  const loadMoreMovies = useCallback(
    (node) => {
      let query;

      if (node && node[0].isIntersecting && hasNextPage) {
        if (searchQuery) {
          query = searchQuery;
        } else {
          query = "";
        }
        fetchMoviesWithQuery(query, pageCount + 1);
        observerRef.current?.disconnect();
      }
    },
    [hasNextPage, fetchMoviesWithQuery, pageCount, searchQuery]
  );

  useEffect(() => {
    fetchMoviesWithQuery();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(loadMoreMovies, {
      threshold: 1.0,
      root: null,
      rootMargin: "10px",
    });
    if (observerRef.current && intersectionTargetRef.current) {
      observerRef.current?.observe(intersectionTargetRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current?.disconnect();
      }
    };
  }, [loadMoreMovies]);

  return {
    fetchMoviesWithQuery,
    searchMovies,
    intersectionTargetRef,
  };
};

const debounce = (fn, delay) => {
  let debounceTimer;
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
