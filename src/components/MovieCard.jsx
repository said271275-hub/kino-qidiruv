import { posterUrl } from "../api/tmdb.js";

export default function MovieCard({ movie, isFavorite, onToggleFavorite, onOpen }) {
  const poster = posterUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "-";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "-";

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-slate-800 shadow-lg transition hover:-translate-y-1 hover:shadow-amber-400/10">
      <button type="button" onClick={() => onOpen(movie)} className="block w-full text-left">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center bg-slate-700 text-slate-400">
            Rasm yo'q
          </div>
        )}
        <div className="p-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</h3>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>{year}</span>
            <span className="font-semibold text-amber-400">★ {rating}</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onToggleFavorite(movie)}
        aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
        aria-pressed={isFavorite}
        className={
          "absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg transition hover:scale-110 " +
          (isFavorite ? "text-red-500" : "text-white")
        }
      >
        ♥
      </button>
    </article>
  );
}
