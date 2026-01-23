import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupportedMakes } from "../lib/fitments/getSupportedMakes";

type Status = "idle" | "loading" | "success" | "error";

export function MakePickerPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>("idle");
  const [makes, setMakes] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function run() {
      setStatus("loading");
      setError(null);

      try {
        const res = await getSupportedMakes();
        if (!isMounted) return;

        setMakes(res);
        setStatus("success");
      } catch (e) {
        if (!isMounted) return;

        setError(e instanceof Error ? e.message : "Unknown error");
        setStatus("error");
      }
    }

    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMakes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return makes;
    return makes.filter((m) => m.toLowerCase().includes(q));
  }, [makes, query]);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Velg bilmerke</h1>
        <p className="text-sm text-gray-500">
          Viser kun merker vi har mal-data for.
        </p>
      </div>

      <div className="mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk etter bilmerke…"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {status === "loading" && (
        <div className="text-sm text-gray-500">Laster bilmerker…</div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm">
          Kunne ikke hente bilmerker: {error}
        </div>
      )}

      {status === "success" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredMakes.map((make) => (
            <button
              key={make}
              onClick={() => navigate(`/make/${encodeURIComponent(make)}`)}
              className="rounded-lg border p-3 text-left hover:bg-gray-50"
            >
              {/* TODO: replace text with logo when ready */}
              <div className="font-medium">{make}</div>
            </button>
          ))}
        </div>
      )}

      {status === "success" && filteredMakes.length === 0 && (
        <div className="text-sm text-gray-500">Ingen treff.</div>
      )}
    </div>
  );
}
