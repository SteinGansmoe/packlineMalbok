// src/lib/fitments/getSupportedMakes.ts
import { supabase } from "../supabaseClient";

type CarsJoin =
  | { make: string | null }
  | { make: string | null }[]
  | null
  | undefined;

export async function getSupportedMakes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("v2_fitments")
    .select("v2_cars(make)");

    

  if (error) throw new Error(error.message);

  const makes = new Set<string>();

  for (const row of data ?? []) {
    const cars = (row as { v2_cars?: CarsJoin }).v2_cars;

    const car = Array.isArray(cars) ? cars[0] : cars;
    const make = car?.make?.trim();

    if (make) makes.add(make);
  }

  return Array.from(makes).sort((a, b) => a.localeCompare(b, "nb"));
}
