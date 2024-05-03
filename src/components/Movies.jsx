import Movie from "./Movie";
import "../styles/movies.scss";
import { useFetchMovies } from "../hooks/useFetchMovies";
import { useSelector } from "react-redux";

const Movies = () => {
  const movies = useSelector((state) => state.movies.movies);

  return (
    <div data-testid="movies" className="movie-grid">
      {movies.results?.map((movie) => {
        return <Movie movie={movie} key={movie.id} />;
      })}
    </div>
  );
};

export default Movies;
