import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type Status = "idle" | "saving" | "success" | "error";

export function CreateCarPage() {
  const navigate = useNavigate();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(""); // keep as string
  const [roof, setRoof] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [createdCarId, setCreatedCarId] = useState<string | null>(null);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const yearNumber = year.trim() === "" ? null : Number(year);

  function validate(): string | null {
    if (!make.trim()) return "Bil merke må fylles ut.";
    if (!model.trim()) return "Modell må fylles ut.";
    if (!roof.trim()) return "Type takfeste må fylles ut.";

    if (yearNumber === null || Number.isNaN(yearNumber)) return "Årsmodell må være et tall.";
    if (!Number.isInteger(yearNumber)) return "Årsmodell må være et heltall.";
    if (yearNumber < 1980 || yearNumber > currentYear + 1) return `Årsmodell må være mellom 1980 og ${currentYear + 1}.`;

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("saving");

    const { data, error } = await supabase
      .from("v2_cars")
      .insert({
        make: make.trim(),
        model: model.trim(),
        year: yearNumber!,
        roof: roof.trim(),
      })
      .select("id")
      .single();

    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }

    setCreatedCarId(data.id);
    setStatus("success");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Ny bil</h1>
      <p className="mt-1 text-sm text-gray-500">Legg til bil som senere vil ha mal.</p>

      {status === "error" && error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
          {error}
        </div>
      )}

      {status === "success" && createdCarId && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm">
          Bil opprettet.
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-md border px-3 py-2 hover:bg-white"
              onClick={() => navigate(`/fitments/new?carId=${createdCarId}`)}
            >
              Legg til mal
            </button>
            <button
              className="rounded-md border px-3 py-2 hover:bg-white"
              onClick={() => navigate("/")}
            >
              Til forsiden
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Bil merke</span>
          <input
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Bil"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Modell</span>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Modell"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Årsmodell</span>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="2020"
            inputMode="numeric"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Type takfeste</span>
          <input
            value={roof}
            onChange={(e) => setRoof(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Flush rails / Faste festepunkter / etc"
          />
        </label>

        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-md border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          {status === "saving" ? "Lagrer…" : "Legg til bil"}
        </button>
      </form>
    </div>
  );
}
