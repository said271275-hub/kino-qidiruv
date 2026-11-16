import { useEffect } from "react";
import { posterUrl } from "../api/tmdb.js";

export default function MovieModal({ movie, isFavorite, onToggleFavorite, onClose }) {
  // Esc tugmasi bilan yopish
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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

        <div className="flex flex-col gap-3 p-6">
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
          <button
            type="button"
            onClick={() => onToggleFavorite(movie)}
            className="mt-auto w-fit rounded-xl bg-amber-400 px-5 py-2 font-semibold text-slate-900 transition hover:bg-amber-300"
          >
            {isFavorite ? "♥ Sevimlilardan olib tashlash" : "♡ Sevimlilarga qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}
