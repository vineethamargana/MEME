import supabase from "../_shared/_config/supabaseClient.ts";

export default async function unlikeMemeRepository(meme_id: string, user_id: string) {
    try {
        // 1. Check if user exists
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('user_id')
            .eq('user_id', user_id)
            .single();

        if (userError || !existingUser) {
            return {
                status: 403,
                message: "User does not exist or is not authorized to unlike memes."
            };
        }

        // 2. Check if meme exists
        const { data: existingMeme, error: memeError } = await supabase
            .from('memes')
            .select('meme_id, like_count')
            .eq('meme_id', meme_id)
            .single();

        if (memeError || !existingMeme) {
            return {
                status: 404,
                message: "Meme does not exist."
            };
        }

        // 3. Check if the user has liked the meme
        const { data: isLiked, error: likeError } = await supabase
            .from('likes')
            .select('*')
            .eq('user_id', user_id)
            .eq('meme_id', meme_id)
            .single();

        if (likeError || !isLiked) {
            return {
                status: 404,
                message: "Like doesnot exist."
            };
        }

        // 4. Remove the like entry
        const { error: unlikeError } = await supabase
            .from('likes')
            .delete()
            .eq('user_id', user_id)
            .eq('meme_id', meme_id);

        if (unlikeError) {
            console.error("Unlike meme error:", unlikeError);
            return {
                status: 500,
                message: "An error occurred while unliking the meme."
            };
        }

        // 5. Update the meme's like count
       // const newLikeCount = existingMeme.like_count - 1;
        const { error: updateError } = await supabase
            .from('memes')
            .update({ like_count: existingMeme.like_count-1 })
            .eq('meme_id', meme_id)
            .single();

        if (updateError) {
            console.error("Update meme like count error:", updateError);
            return {
                status: 500,
                message: "An error occurred while updating the meme's like count."
            };
        }

        return {
            status: 200,
            message: "Meme unliked successfully."
        };
    } catch (error) {
        console.error("Error in unlikeMemeRepository:", error);
        return {
            status: 500,
            message: "An unexpected error occurred."
        };
    }
}
