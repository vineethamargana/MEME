import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import getmemebyIdRepo from "../_repositories/getmemebyidrepo.ts";
import { ERROR_MESSAGES } from "../_shared/_constants/ErrorMessages.ts";

export default async function getmemebyIDController(req: Request) {
    try {
        const url = new URL(req.url);
        const meme_id = url.searchParams.get('meme_id');
        
        if (!meme_id) {
            console.log("Meme ID not specified");
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "meme_id not specified")),
                { status: 400 }
            );
        }

        const result = await getmemebyIdRepo(meme_id);

        if (result.status === 404) {
            return new Response(
                JSON.stringify(new ApiResponseClass(result.status, result.message)),
                { status: 404 }
            );
        }

        if (result.data) {
            // Add cache headers
            const headers = new Headers();
            headers.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
            headers.set("ETag", `"${result.data.meme_id}-${result.data.updated_at}"`);
            headers.set("Last-Modified", result.data.updated_at);

            return new Response(
                JSON.stringify(new ApiResponseClass(result.status, result.message, result.data)),
                { status: result.status, headers }
            );
        } else {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES.Forbidden, "This meme is restricted and cannot be viewed.")),
                { status: 403 }
            );
        }

    } catch (error) {
        console.error("Error in getmemebyIDController: ", error);
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], ERROR_MESSAGES.InternalServerError, error)),
            { status: 500 }
        );
    }
}
