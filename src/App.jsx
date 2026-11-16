import { useEffect, useRef, useState } from "react";
import { API_KEY, buildUrl, fetchJson, mergeLanguages } from "./api/tmdb.js";
import useLocalStorage from "./hooks/useLocalStorage.js";
import MovieCard from "./components/MovieCard.jsx";
import MovieModal from "./components/MovieModal.jsx";
import Loader from "./components/Loader.jsx";

export default function App() {
  const [input, setInput] = useState(""); // qutichadagi matn
  const [search, setSearch] = useState({ query: "", page: 1 }); // 0.5 soniya kutib yuboriladigan so'rov
  const [result, setResult] = useState({ query: null, page: 0, items: [], totalPages: 0, error: "" });
  const [favorites, setFavorites] = useLocalStorage("kino-sevimlilar", []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selected, setSelected] = useState(null);
  const timer = useRef(null);

  // Yozishdan to'xtaganda 500 ms dan keyin qidiramiz (har harfga so'rov yubormaslik uchun)
  const handleInput = (value) => {
    setInput(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearch({ query: value.trim(), page: 1 }), 500);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Kinolarni yuklash
  useEffect(() => {
    if (!API_KEY) return;
    const { query, page } = search;
    let cancelled = false;

    // O'zbekcha va inglizcha natijalarni parallel olamiz (biri ishlamasa ikkinchisi yetadi)
    Promise.allSettled([
      fetchJson(buildUrl(query, page, "uz-UZ")),
      fetchJson(buildUrl(query, page, "en-US")),
    ])
      .then(([uzRes, enRes]) => {
        if (cancelled) return;
        if (uzRes.status === "rejected" && enRes.status === "rejected") {
          throw new Error("Server xatosi");
        }
        const empty = { results: [], total_pages: 0 };
        const uz = uzRes.status === "fulfilled" ? uzRes.value : empty;
        const en = enRes.status === "fulfilled" ? enRes.value : empty;
        const merged = mergeLanguages(uz.results, en.results);

        setResult((prev) => {
          const keepOld = page > 1 && prev.query === query;
          const seen = new Set(keepOld ? prev.items.map((m) => m.id) : []);
          return {
            query,
            page,
            items: keepOld ? [...prev.items, ...merged.filter((m) => !seen.has(m.id))] : merged,
            totalPages: Math.max(uz.total_pages, en.total_pages),
            error: "",
          };
        });
      })
      .catch(() => {
        if (cancelled) return;
        setResult((prev) => ({
          query,
          page,
          items: prev.query === query ? prev.items : [],
          totalPages: 0,
          error: "Kinolarni yuklab bo'lmadi. Internetni tekshiring.",
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [search]);

  const isFavorite = (movie) => favorites.some((f) => f.id === movie.id);
  const toggleFavorite = (movie) =>
    setFavorites((prev) =>
      prev.some((f) => f.id === movie.id) ? prev.filter((f) => f.id !== movie.id) : [...prev, movie]
    );

  const loading = result.query !== search.query || result.page !== search.page;
  const firstLoad = loading && result.query !== search.query;
  const movies = showFavorites ? favorites : result.items;
  const canLoadMore = !showFavorites && !loading && search.page < result.totalPages;

  const title = showFavorites
    ? `Sevimlilar (${favorites.length})`
    : search.query
      ? `"${search.query}" bo'yicha natijalar`
      : "Mashhur kinolar";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <h1 className="text-xl font-extrabold text-amber-400">🎬 KinoQidiruv</h1>
          <input
            type="search"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Kino nomini yozing (o'zbekcha yoki inglizcha)..."
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={() => setShowFavorites((v) => !v)}
            aria-pressed={showFavorites}
            className={
              "rounded-xl px-4 py-2 text-sm font-semibold transition " +
              (showFavorites
                ? "bg-amber-400 text-slate-900"
                : "border border-amber-400 text-amber-400 hover:bg-amber-400/10")
            }
          >
            ♥ Sevimlilar ({favorites.length})
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!API_KEY ? (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-400">API kalit topilmadi</h2>
            <p className="text-slate-300">
              Loyiha papkasida <code className="text-amber-300">.env.local</code> fayl yarating va
              ichiga <code className="text-amber-300">VITE_TMDB_KEY=sizning_kalitingiz</code> deb
              yozing. Keyin <code className="text-amber-300">npm run dev</code> ni qayta ishga
              tushiring.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-5 text-lg font-semibold text-slate-300">{title}</h2>

            {result.error && (
              <p className="mb-4 rounded-xl bg-red-500/10 p-4 text-red-400">{result.error}</p>
            )}

            {firstLoad && !showFavorites ? (
              <Loader />
            ) : movies.length === 0 && !loading && !result.error ? (
              <p className="py-12 text-center text-slate-400">
                {showFavorites
                  ? "Hali sevimli kino yo'q. Kartochkadagi ♥ tugmasini bosing."
                  : "Hech narsa topilmadi."}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {movies.map((m) => (
                  <MovieCard
                    key={m.id}
                    movie={m}
                    isFavorite={isFavorite(m)}
                    onToggleFavorite={toggleFavorite}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            )}

            {loading && !firstLoad && !showFavorites && <Loader />}

            {canLoadMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setSearch((s) => ({ ...s, page: s.page + 1 }))}
                  className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-300"
                >
                  Yana yuklash
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <MovieModal
          movie={selected}
          isFavorite={isFavorite(selected)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
