import {
  Link,
  NavLink,
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatchMovies } from "../hooks/useDispatchMovies";
import debounce from "lodash.debounce";

import "../styles/header.scss";
import { useCallback } from "react";

const Header = () => {
  const { starredMovies } = useSelector((state) => state.starred);
  const dispatchMovies = useDispatchMovies();
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchMovies = useCallback(
    (query) => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      query === ""
        ? navigate("/")
        : setSearchParams(createSearchParams({ search: query }));

      dispatchMovies(query);
    },
    [dispatchMovies, navigate, setSearchParams]
  );

  const debounceKeyUp = debounce((e) => {
    searchMovies(e); // debounce to limit the number of request when the user fill in the input field
  }, 350);

  return (
    <header>
      <Link to="/" data-testid="home" onClick={() => searchMovies("")}>
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink
          to="/starred"
          data-testid="nav-starred"
          className="nav-starred"
        >
          {starredMovies.length > 0 ? (
            <>
              <i className="bi bi-star-fill bi-star-fill-white" />
              <sup className="star-number">{starredMovies.length}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to="/watch-later" className="nav-fav">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded">
        <Link to="/" className="search-link">
          <input
            type="search"
            data-testid="search-movies"
            onKeyUp={(e) => debounceKeyUp(e.target.value)}
            className="form-control rounded"
            placeholder="Search movies..."
            aria-label="Search movies"
            aria-describedby="search-addon"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
