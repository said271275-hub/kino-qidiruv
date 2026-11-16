// TMDB (The Movie Database) bilan ishlash
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export const API_KEY = import.meta.env.VITE_TMDB_KEY;

// Qidiruv so'zi bo'sh bo'lsa mashhur kinolar, aks holda qidiruv natijalari
export function buildUrl(query, page) {
  const params = new URLSearchParams({ api_key: API_KEY, language: "en-US", page });
  if (query) {
    params.set("query", query);
    return `${BASE_URL}/search/movie?${params}`;
  }
  return `${BASE_URL}/movie/popular?${params}`;
}

export function posterUrl(path) {
  return path ? IMAGE_URL + path : null;
}
