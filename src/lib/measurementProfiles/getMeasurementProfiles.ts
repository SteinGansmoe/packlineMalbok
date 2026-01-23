import { supabase } from "../supabaseClient"

export type MeasurementProfile = {
    id: string;
    label: string;
    cut_kind: string;
    precut_available: boolean;
};

export async function getMeasurementProfiles(): Promise<MeasurementProfile[]> {
    const { data, error } = await supabase
    .from("v2_measurement_profiles")
    .select("id, label, cut_kind, precut_available")
    .order("label", { ascending: true})

    if (error) throw new Error(error.message);
    return data ?? [];
}