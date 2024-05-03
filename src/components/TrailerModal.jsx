import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT, API_KEY } from "../constants";
import YouTubePlayer from "./YoutubePlayer";
import trailerSlice from "../data/trailerSlice";
import "../styles/modal.scss";
import spinner from "../assets/spinner.gif";

function TrailerModal() {
  const movieId = useSelector((state) => state.trailer?.movieId);
  const dispatch = useDispatch();
  const { setMovieId } = trailerSlice.actions;

  const [isLoading, setIsLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(null);
  const [error, setError] = useState(false);

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === "Trailer"
      );

      return trailer ? trailer.key : videoData.videos.results[0].key;
    }
    return null;
  };

  const onClose = useCallback(() => {
    dispatch(setMovieId(null));
    setIsLoading(true);
  }, [dispatch, setMovieId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (e) => {
      if (!e.target.classList.contains("modal-player")) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!movieId) return;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    getMovie(movieId)
      .then((key) => {
        setIsLoading(false);
        setVideoKey(key);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [movieId, handleKeyDown, handleClickOutside]);

  if (!movieId) return null;

  return (
    <div className="modal-container">
      <div>
        {!isLoading && !videoKey ? (
          <div className="modal-content-wrapper">
            <h6>No trailer available. Try another movie</h6>
          </div>
        ) : isLoading ? (
          <img src={spinner} alt="spinner" />
        ) : error ? (
          <div className="modal-content-wrapper">
            <h6>Something went wrong, please try again later</h6>
          </div>
        ) : (
          <div className="modal-player">
            <YouTubePlayer videoKey={videoKey} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TrailerModal;
