import supabase from "../_shared/_config/supabaseClient.ts";

export default async function deleteMemeByIdRepository(meme_id: string,user_id:string) 
{
    try {
        // Fetch the meme 
        const { data: existingMeme, error: fetchError } = await supabase
            .from("memes")
            .select("*")
            .eq("meme_id", meme_id)
            .single();

        if (fetchError || !existingMeme || existingMeme.deleted) {
            return { status: 404, message: "Meme not found." };
        } 

        const {data:existinguser,error:existingusererror} = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id).single();

        if (existingusererror ||!existinguser) {
            return { status: 403, message: "User not found." };
        }
        if (existinguser.user_type !== 'M'  && existinguser.user_type !=='A' ) {
            return { status: 403, message: "User not authorized to delete this meme." };
        }

        // Perform soft deletion by updating the 'deleted' flag to TRUE
        const { data, error } = await supabase
            .from("memes")
            .update({ deleted: true, updated_at: new Date().toISOString() })
            .eq("meme_id", meme_id)
            .select("meme_id, deleted, updated_at")
            .single();

        if (error) {
            console.error("Error updating meme for soft deletion:", error);
            return { status: 500, message: `Failed to delete meme: ${error.message}` };
        }

        console.log("Meme soft-deleted successfully:", data);
        return { status: 200, message: "Meme deleted successfully.", data };

    } catch (error) {
        console.error("Error in deleteMemeByIdRepository:", error);
        return { status: 500, message: `Error deleting meme: ${error}` };
    }
}
