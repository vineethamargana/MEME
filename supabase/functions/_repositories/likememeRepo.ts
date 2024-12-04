import supabase from "../_shared/_config/supabaseClient.ts";

export default async function likeMemeRepository(meme_id: string, user_id: string) {
    try {
        // Check if the meme exists
        //1.
        const { data: existingMeme, error: fetchError } = await supabase
            .from("memes")
            .select("*")
            .eq("meme_id", meme_id)
            .single();

        if (fetchError || !existingMeme) {
            return { status: 404, message: "Meme not found" };
        }

        // Check if the user is authorized (e.g., account not suspended)
        //2.
        const { data: existingUser, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", user_id)
            .single();

        if (userError || !existingUser || existingUser.account_status === "suspended") {
            return { status: 403, message: "You are not authorized to like memes." };
        }

        // Check if the user has already liked the meme
        //3.
        const { data: existingLike, error: likeError } = await supabase
            .from("likes")
            .select("*")
            .eq("meme_id", meme_id)
            .eq("user_id", user_id)
            .maybeSingle();

        if (likeError) {
            return { status: 500, message: `Error checking like status: ${likeError.message}` };
        }

        if (existingLike) {
            return { status: 409, message: "You have already liked this meme." };
        }
        
        // Insert a new like record
        //4.
        const { error: insertError } = await supabase
            .from("likes")
            .insert({ meme_id, user_id });

        if (insertError) {
            return { status: 500, message: `Failed to insert like: ${insertError.message}` };
        }

        // Increment the like count in the memes table
        //5.
        const { data: updatedMeme, error: updateError } = await supabase
            .from("memes")
            .update({ like_count: existingMeme.like_count + 1 })
            .eq("meme_id", meme_id)
            .single();

        if (updateError) {
            return { status: 500, message: `Failed to update meme like count: ${updateError.message}` };
        }

        const notificationContent = `Your meme "${existingMeme.meme_title}" received a new like!`;
        const { error: notificationError } = await supabase
            .from("notifications")
            .insert({
                user_id: existingUser.user_id,
                content: notificationContent,
                type: "like",
                created_at: new Date().toISOString(),
                read_status: false,
            });

        if (notificationError) {
            console.error("Failed to notify meme owner:", notificationError);
        }

        // Return success response
        return { status: 200, message: "Meme liked successfully.", data: updatedMeme };
    } catch (error) {
        console.error("Error in likeMemeRepository:", error);
        return { status: 500, message: `Error liking meme: ${ error}` };
    }
}
