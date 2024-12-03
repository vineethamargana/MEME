import updateMemebyIdRepo from "../_repositories/updatememerepo.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";

export default async function updateMemebyId(req: Request) {
    try {
        if (req.method !== 'PATCH')
        {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Method not allowed")),
                { status: 405 }
            );
        }
        const url = new URL(req.url);
        const meme_id = url.searchParams.get("meme_id");

        if (!meme_id) {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing meme_id parameter")),
                { status: 400 }
            );
        }

        const meme = await req.json();
        if (Object.keys(meme).length === 0) {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "No fields found to update")),
                { status: 400 }
            );
        }

        // Validate the input fields
        if (meme.meme_id || meme.image_url || meme.like_count || meme.comment_count || meme.risk_score || meme.created_at || meme.updated_at) {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Modification of protected fields is not allowed")),
                { status: 400 }
            );
        }

        if (meme.meme_title && meme.meme_title.length > 30) {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "meme_title exceeds character limit")),
                { status: 400 }
            );
        }

        if (meme.tags) {
            for (const tag of meme.tags) {
                if (typeof tag !== "string" || tag.length > 15 || tag.length < 1 || !tag.startsWith("#")) {
                    return new Response(
                        JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Invalid tag format or length")),
                        { status: 400 }
                    );
                }
            }
        }

        // Call repository to update meme
        const result = await updateMemebyIdRepo(meme, meme_id);

        return new Response(
            JSON.stringify(new ApiResponseClass(result.status, result.message, result.data)),
            { status: result.status }
        );

    } catch (error) {
        console.error("Error updating meme:", error);
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "Error updating meme")),
            { status: 500 }
        );
    }
}
