
type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  roof: string;
}

type MeasurementProfile = {
  id: string;
  label: string; // "75/60 - 10/20"
  cutKind: "standard" | "tilpasset";
  precutAvailable: boolean;
}

type RoofboxFitment = {
  id: string;
  carId: string;
  measurementId: string;
  box: string;
  rack: string;
  cc: number;
  cb: number;
  frontValue?: number;
  frontNote?: string;
  backValue?: number;
  backNote?: string;
}