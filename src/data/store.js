import { configureStore } from "@reduxjs/toolkit";
import moviesSlice from "./moviesSlice";
import starredSlice from "./starredSlice";
import watchLaterSlice from "./watchLaterSlice";
import trailerSlice from "./trailerSlice";

const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
    starred: starredSlice.reducer,
    watchLater: watchLaterSlice.reducer,
    trailer: trailerSlice.reducer,
  },
});

export default store;
