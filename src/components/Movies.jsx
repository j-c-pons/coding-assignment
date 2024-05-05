import { useEffect, useState, useCallback } from "react";
import Movie from "./Movie";
import { useDispatchMovies } from "../hooks/useDispatchMovies";
import { useSelector } from "react-redux";
import throttle from "lodash.throttle";
import { useSearchParams } from "react-router-dom";

import spinner from "../assets/spinner.gif";
import "../styles/movies.scss";

const Movies = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatchMovies = useDispatchMovies();

  const movies = useSelector((state) => state.movies.movies);
  const hasNext = useSelector((state) => state.movies.hasNext);
  const pageCount = useSelector((state) => state.movies.page);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const handleScroll = useCallback(async () => {
    if (checkScrollToBottom() && hasNext) {
      setIsLoading(true);
      let query = searchQuery ? searchQuery : "";
      await dispatchMovies(query, pageCount + 1);
      setIsLoading(false);
    }
  }, [hasNext, dispatchMovies, pageCount, searchQuery]);

  const checkScrollToBottom = () => {
    const scrolledToBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (scrolledToBottom) return true;
    return false;
  };

  useEffect(() => {
    searchParams.get("search")
      ? dispatchMovies(searchParams.get("search"))
      : dispatchMovies();
  }, []);

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
      </div>

      {isLoading && (
        <div className="spinner-container">
          <img src={spinner} className="spinner-img" alt="spinner" />
        </div>
      )}
    </div>
  );
};

export default Movies;
