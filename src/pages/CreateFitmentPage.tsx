import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react"
import { getBoxModels, type BoxModel } from "../lib/boxModels/getBoxModels";
import { getCars, type Car } from "../lib/cars/getCars";
import { getMeasurementProfiles, type MeasurementProfile } from "../lib/measurementProfiles/getMeasurementProfiles";


type Status = "idle" | "loading" | "saving" | "error";

export function CreateFitmentPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const [cars, setCars] = useState<Car[]>([]);
    const [boxModels, setBoxModels] = useState<BoxModel[]>([]);
    const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);

    const [carId, setCarId] = useState("");
    const [boxModelId, setBoxModelId] = useState("");
    const [measurementId, setMeasurementId] = useState("");

    const [rack, setRack] = useState("");
    const [cc, setCc] = useState("");
    const [cb, setCb] = useState("");
    const [frontValue, setFrontValue] = useState("");
    const [frontNote, setFrontNote] = useState("");
    const [backValue, setBackValue] = useState("");
    const [backNote, setBackNote] = useState("");
    
    


    useEffect(() => {
  async function load() {
    setError(null);
    setStatus("loading");

    try {
      const [carsRes, boxModelsRes, profilesRes] = await Promise.all([
        getCars(),
        getBoxModels(),
        getMeasurementProfiles(),
      ]);

      setCars(carsRes);
      setBoxModels(boxModelsRes);
      setProfiles(profilesRes);

      if (profilesRes.length === 1) {
        setMeasurementId(profilesRes[0].id);
      }

      const presetCarId = searchParams.get("carId");
      if (presetCarId && carsRes.some((c) => c.id === presetCarId)) {
        setCarId(presetCarId)
      }

      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
      setStatus("error");
    }

  }

  load();
}, [searchParams]);

return (
<div>
    <select value={carId} onChange={(e) => setCarId(e.target.value)}>
  <option value="">Velg bil…</option>
  {cars.map((c) => (
    <option key={c.id} value={c.id}>
      {c.make} {c.model} ({c.year}) – {c.roof}
    </option>
  ))}
</select>
</div>)
}