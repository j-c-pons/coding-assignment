import { createSlice } from "@reduxjs/toolkit";

const trailerSlice = createSlice({
  name: "trailer",
  initialState: {
    movieId: null,
  },
  reducers: {
    setMovieId: (state, action) => {
      return { ...state, movieId: action.payload };
    },
  },
});

export default trailerSlice;
