import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  fetchStatus: "",
  page: 1,
  hasNext: false,
};

export const fetchMovies = createAsyncThunk("fetch-movies", async (apiUrl) => {
  const response = await fetch(apiUrl);
  return response.json();
});

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { results = [], page = 1, total_pages = 0 } = action.payload;
        // if ((results.length = 0)) {
        //   console.log("test");
        // }
        if (results.length > 0) {
          if (page === 1) {
            //new search or discover > only keep the latest data
            state.movies = results;
          } else {
            // new page > increment the data
            state.movies = [...state.movies, ...results];
          }
          state.page = page;
          state.hasNext = page < total_pages;
        } else {
          state.movies = [];
        }
        state.fetchStatus = "success";
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = "error";
      });
  },
});

export default moviesSlice;
