import deleteMemeByIdRepository from "../_repositories/DeleteMemeByIDRepo.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";

export default async function DeletememebyID(req: Request) {
    try {
        const url = new URL(req.url);
        const meme_id = url.searchParams.get("meme_id");
        const user_id = req.headers.get("user_id"); // User ID from header
        if (!meme_id) {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing meme_id parameter")),
                { status: 400 }
            );
        }

        if (!user_id) {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Forbidden"], "User not authorized")),
                { status: 403 }
            );
        }

        const result = await deleteMemeByIdRepository(meme_id, user_id);

        if (result.status === 204) {
            return new Response(null, { status: 204 }); // No Content response for successful deletion
        }

        return new Response(
            JSON.stringify(new ApiResponseClass(result.status, result.message)),
            { status: result.status }
        );
    } catch (error) {
        console.error("Error in DeletememebyID controller:", error);
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "Unexpected error occurred")),
            { status: 500 }
        );
    }
}
