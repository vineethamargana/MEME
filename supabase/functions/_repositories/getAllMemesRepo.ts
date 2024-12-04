import supabase from "../_shared/_config/supabaseClient.ts";

export default async function getAllMemesRepo(req: Request){
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get("page")||1);
        const limit = Number(url.searchParams.get("limit")||5);
        const sort = url.searchParams.get("sort") || "popular";

        let query = supabase
        .from("memes")
        .select("meme_id, user_id, meme_title, image_url, like_count, flag_count, tags, created_at")
        .eq("meme_status","Approved");

        if(sort=="popular")
        {
           query = query.order("like_count", { ascending: false });
        }
        else if(sort=="created_at")
        {
            query = query.order("created_at", { ascending: false });
        }

        const offset = (page - 1) * limit; // number of items to skip before starting to fetch
        query = query.range(offset, offset + limit-1);

        const { data, error } = await query
        
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

