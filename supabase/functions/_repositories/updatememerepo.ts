import { MemeImpl } from "../_models/Meme1Model.ts";
import supabase from "../_shared/_config/supabaseClient.ts";

export default async function updateMemebyId(meme: Partial<MemeImpl>, meme_id: string, user_id: string) {
    try {
        const { data: existingMeme, error: fetchError } = await supabase
            .from("memes")
            .select("*")
            .eq("meme_id", meme_id)
            .single();

        if (fetchError || !existingMeme) {
            return { status: 404, message: "Meme not found." };
        }

        // Check if user is authorized to update the meme
        const {data:existinguser,error:existingusererror} = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id).single();

        if (existingusererror ||!existinguser) {
            return { status: 403, message: "User not found." };
        }
        if (existinguser.user_type !== 'M'  &&  existinguser.user_type !=='A' ) {
            return { status: 403, message: "User not authorized to update this meme." };
        }


        // Check for conflicts
        if(existingMeme.meme_title === meme.meme_title)
        {
            return { status: 409, message: "meme with same title already exist" };
        }

        
        // Perform the update
        const { data, error } = await supabase
            .from("memes")
            .update({
                meme_title: meme.meme_title,
                tags: meme.tags,
                updated_at: new Date().toISOString(),
            })
            .eq("meme_id", meme_id)
            .select("meme_id, meme_title, tags, updated_at")
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return { status: 200, message: "Meme updated successfully.", data };

    } catch (error) {
        console.error("Error in updateMemebyIdRepo:", error);
        return { status: 500, message: `Error updating meme: ${error}` };
    }
}
