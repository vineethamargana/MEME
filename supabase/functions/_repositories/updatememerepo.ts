import { MemeImpl } from "../_models/Meme1Model.ts";
import supabase from "../_shared/_config/supabaseClient.ts";

export default async function updateMemebyId(
    meme: Partial<MemeImpl>,
    meme_id: string,
    user_id: string,
    is_admin: boolean
) {
    try {
        const { data: existingMeme, error: fetchError } = await supabase
            .from("memes")
            .select("user_id")
            .eq("meme_id", meme_id)
            .single();

        if (fetchError || !existingMeme) {
            return { status: 404, message: "Meme not found." };
        }

        // Check if user is authorized to update the meme
        if (!is_admin && existingMeme.user_id !== user_id) {
            return { status: 403, message: "User not authorized to update this meme." };
        }

        // Check for conflicts
        const { data: conflictCheck, error: conflictError } = await supabase
            .from("memes")
            .select("meme_id")
            .eq("meme_title", meme.meme_title)
            .neq("meme_id", meme_id);

        if (conflictCheck && conflictCheck.length > 0 ||conflictError) {
            return { status: 409, message: "Meme title conflicts with another meme." };
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
