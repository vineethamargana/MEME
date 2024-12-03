import deleteMemeByIdRepository from "../_repositories/DeleteMemeByIDRepo.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";

export default async function DeletememebyID(req: Request) {
    try {
        if (req.method !== 'DELETE') 
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

        const result = await deleteMemeByIdRepository(meme_id);

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
