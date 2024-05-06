import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Movie from "./Movie";
import { useDispatchMovies } from "../hooks/useDispatchMovies";

import throttle from "lodash.throttle";

import spinner from "../assets/spinner.gif";
import "../styles/movies.scss";

const Movies = () => {
  const dispatchMovies = useDispatchMovies();
  const movies = useSelector((state) => state.movies.movies);
  const moviesEmpty = useSelector((state) => state.movies.moviesEmpty);
  const hasNext = useSelector((state) => state.movies.hasNext);
  const pageCount = useSelector((state) => state.movies.page);
  const fetchStatus = useSelector((state) => state.fetchStatus);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const handleScroll = useCallback(async () => {
    if (checkScrollToBottom() && hasNext) {
      let query = searchQuery ? searchQuery : "";
      await dispatchMovies(query, pageCount + 1);
    }
  }, [hasNext, dispatchMovies, pageCount, searchQuery]);

  const checkScrollToBottom = () => {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  };

  useEffect(() => {
    searchParams.get("search")
      ? dispatchMovies(searchParams.get("search"))
      : dispatchMovies();
  }, [dispatchMovies, searchParams]);

  useEffect(() => {
    const onScroll = throttle(() => {
      handleScroll(); // use throttle to limit the number of requests when the user scrolls too fast.
    }, 400);

    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

  return (
    <div>
      <div data-testid="movies" className="movie-grid">
        {movies?.map((movie) => {
          return <Movie movie={movie} key={movie.id} />;
        })}
        {moviesEmpty && <div>No result found</div>}
      </div>

      {fetchStatus === "loading" && (
        <div className="spinner-container">
          <img src={spinner} className="spinner-img" alt="spinner" />
        </div>
      )}
    </div>
  );
};

export default Movies;
