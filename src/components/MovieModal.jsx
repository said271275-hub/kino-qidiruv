import { useEffect, useState } from "react";
import { fetchJson, posterUrl, videosUrl } from "../api/tmdb.js";

export default function MovieModal({ movie, isFavorite, onToggleFavorite, onClose }) {
  const [trailer, setTrailer] = useState({ id: null, key: null });
  const [showTrailer, setShowTrailer] = useState(false);

  // Esc tugmasi bilan yopish
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Treylerni YouTube'dan topamiz
  useEffect(() => {
    let cancelled = false;
    fetchJson(videosUrl(movie.id))
      .then((json) => {
        const videos = (json.results ?? []).filter(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        const pick = videos.find((v) => v.official) ?? videos[0];
        if (!cancelled) setTrailer({ id: movie.id, key: pick?.key ?? null });
      })
      .catch(() => {
        if (!cancelled) setTrailer({ id: movie.id, key: null });
      });
    return () => {
      cancelled = true;
    };
  }, [movie.id]);

  const trailerLoading = trailer.id !== movie.id;
  const poster = posterUrl(movie.poster_path);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-slate-800 text-white sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl"
        >
          ×
        </button>

        {poster && (
          <img src={poster} alt={movie.title} className="w-full object-cover sm:w-72" />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-6">
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          <p className="text-sm text-slate-400">
            {movie.release_date || "Sana noma'lum"} ·{" "}
            <span className="font-semibold text-amber-400">
              ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "-"}
            </span>{" "}
            ({movie.vote_count ?? 0} ovoz)
          </p>
          <p className="leading-relaxed text-slate-200">
            {movie.overview || "Bu kino uchun tavsif mavjud emas."}
          </p>

          {showTrailer && trailer.key && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
                title={`${movie.title} treyleri`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-3">
            {trailerLoading ? (
              <span className="py-2 text-sm text-slate-400">Treyler qidirilmoqda...</span>
            ) : trailer.key ? (
              <button
                type="button"
                onClick={() => setShowTrailer((v) => !v)}
                className="rounded-xl bg-red-600 px-5 py-2 font-semibold transition hover:bg-red-500"
              >
                {showTrailer ? "■ Treylerni yopish" : "▶ Treyler ko'rish"}
              </button>
            ) : (
              <span className="py-2 text-sm text-slate-400">Treyler topilmadi</span>
            )}

            <button
              type="button"
              onClick={() => onToggleFavorite(movie)}
              className="rounded-xl bg-amber-400 px-5 py-2 font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              {isFavorite ? "♥ Sevimlilardan olib tashlash" : "♡ Sevimlilarga qo'shish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
