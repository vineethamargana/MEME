import supabase from "../_shared/_config/supabaseClient.ts";

export default async function getmemebyIdRepo(meme_id: string) {
    try {
        // Fetch meme details from the database
        const { data:existingMeme, error:existingMemeError } = await supabase
            .from("memes")
            .select('meme_id, meme_title, image_url, like_count, comment_count, tags, updated_at, deleted')
            .eq("meme_id", meme_id)
            .single();

            if ( existingMemeError || !existingMeme ) {
                return { status: 404, message: "Meme not found." };
            } 
        // If the meme is marked as deleted or restricted, return 403
        if (existingMeme && existingMeme.deleted) {
            console.log("Meme is restricted or deleted");
            return {
                status: 403,
                message: "This meme is restricted and cannot be viewed."
            };
        }

        // Meme found and not deleted
        console.log("Meme found: ", existingMeme);
        return {
            status: 200,
            message: "Meme retrieved successfully",
            data: {
                meme_id: existingMeme.meme_id,
                meme_title: existingMeme.meme_title,
                image_url: existingMeme.image_url,
                like_count: existingMeme.like_count,
                comment_count: existingMeme.comment_count,
                tags: existingMeme.tags,
                updated_at: existingMeme.updated_at
            }
        };

    } catch (error) {
        console.error("Error in getmemebyIdRepo: ", error);
        return {
            status: 500,
            message: `Failed to fetch meme by ID: ${error instanceof Error ? error.message : error}`
        };
    }
}
