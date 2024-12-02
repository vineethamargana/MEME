import supabase from "../_shared/_config/supabaseClient.ts";

export default async function getAllMemesRepo() {
    try {
        const { data, error } = await supabase
            .from("memes")
            .select("meme_id, user_id, meme_title, image_url, like_count, flag_count, tags, created_at");

        if (error) {
            console.error("Error fetching memes: ", error);
            return {
                status: 500,
                message: `Failed to fetch memes: ${error.message}`,
            };
        }

        if (!data || data.length === 0) {
            console.log("No memes found");
            return {
                status: 404,
                message: "No memes found",
            };
        }

        console.log("Memes fetched successfully: ", data);
        return {
            status: 200,
            message: "Memes retrieved successfully",
            data: data,
        };
    } catch (error) {
        console.error("Error in getAllMemesRepo: ", error);
        return {
            status: 500,
            message: `Failed to fetch memes: ${error instanceof Error ? error.message : error}`,
        };
    }
}
