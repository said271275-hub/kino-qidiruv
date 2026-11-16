// TMDB (The Movie Database) bilan ishlash
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export const API_KEY = import.meta.env.VITE_TMDB_KEY;

// Qidiruv so'zi bo'sh bo'lsa mashhur kinolar, aks holda qidiruv natijalari
export function buildUrl(query, page, language = "en-US") {
  const params = new URLSearchParams({ api_key: API_KEY, language, page });
  if (query) {
    params.set("query", query);
    return `${BASE_URL}/search/movie?${params}`;
  }
  return `${BASE_URL}/movie/popular?${params}`;
}

// Kinoning treyler (video) ro'yxati
export function videosUrl(id) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    include_video_language: "en,null",
  });
  return `${BASE_URL}/movie/${id}/videos?${params}`;
}

export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Server xatosi");
  return res.json();
}

export function posterUrl(path) {
  return path ? IMAGE_URL + path : null;
}

// O'zbekcha va inglizcha natijalarni birlashtiradi:
// nom, tavsif va poster o'zbekcha bo'lsa o'shani, bo'lmasa inglizchasini oladi
export function mergeLanguages(uz = [], en = []) {
  const uzById = new Map(uz.map((m) => [m.id, m]));
  const enById = new Map(en.map((m) => [m.id, m]));
  const ids = [...new Set([...en.map((m) => m.id), ...uz.map((m) => m.id)])];

  return ids.map((id) => {
    const u = uzById.get(id);
    const e = enById.get(id);
    const base = e ?? u;
    return {
      ...base,
      title: u?.title || base.title,
      overview: u?.overview || base.overview,
      poster_path: u?.poster_path || base.poster_path,
    };
  });
}
