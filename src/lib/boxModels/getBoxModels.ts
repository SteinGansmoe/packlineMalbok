import { supabase } from "../supabaseClient";

export type BoxModel = {
    id: string;
    name: string;
    // is_active: boolean;
};

export async function getBoxModels(): Promise<BoxModel[]> {
    const { data, error} = await supabase
    .from("v2_box_models")
    .select("id, name")
    .order("name", { ascending: true});

    if (error) throw new Error(error.message);
    return data ?? [];
}



