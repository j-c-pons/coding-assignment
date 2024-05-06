import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchMovies } from "../data/moviesSlice";

import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH } from "../constants";

export const useDispatchMovies = () => {
  const dispatch = useDispatch();

  const dispatchMovies = useCallback(
    (query = "", page = 1) => {
      const endpointUrl = query === "" ? ENDPOINT_DISCOVER : ENDPOINT_SEARCH;
      const fetchURL = `${endpointUrl}${query}&page=${page}`;
      dispatch(fetchMovies(fetchURL));
    },
    [dispatch]
  );

  return dispatchMovies;
};
