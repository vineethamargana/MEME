import getAllMemesRepo from "../_repositories/getAllMemesRepo.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";

export default async function getAllMemes(req:Request) {
    try {
        if(req.method !== "GET")
        {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"], "Only GET method is supported")),
                { status: 405 }
            );
        }
        const result = await getAllMemesRepo();

        if (result.status !== 200) {
            return new Response(
                JSON.stringify(new ApiResponseClass(result.status, result.message)),
                { status: result.status }
            );
        }

        return new Response(
            JSON.stringify(new ApiResponseClass(result.status, result.message, result.data)),
            { status: result.status }
        );
    } catch (error) {
        console.error("Error in getAllMemes controller: ", error);
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "Unexpected error occurred", error)),
            { status: 500 }
        );
    }
}
