export const API_KEY = "8cac6dec66e09ab439c081b251304443";
export const ENDPOINT = "https://api.themoviedb.org/3";
export const ENDPOINT_DISCOVER =
  ENDPOINT +
  "/discover/movie?api_key=" +
  API_KEY +
  "&sort_by=vote_count.desc&query=";
export const ENDPOINT_SEARCH =
  ENDPOINT + "/search/movie?api_key=" + API_KEY + "&query=";
