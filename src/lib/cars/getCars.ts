import { supabase } from "../supabaseClient";


export type Car = {
    id: string;
    make: string;
    model: string;
    year: number;
    roof: string;
};

export async function getCars(): Promise<Car[]> {
    const { data, error } = await supabase
    .from("v2_cars")
    .select("id, make, model, year, roof")
    .order("make", { ascending: true })
    .order("model", { ascending: true })
    .order("year", { ascending: false });

    if (error) throw new Error(error.message);

    return data ?? [];
}