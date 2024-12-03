import { MemeImpl } from "../_models/Meme1Model.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ERROR_MESSAGES } from "../_shared/_constants/ErrorMessages.ts";
import creatememeUsingbucketRepo from "../_repositories/creatememecheckimageRepo.ts";


export default async function creatememeController2(req: Request) {
    console.log("Processing request in creatememeController");

    try {
        // Validate request method
        if(req.method !== "POST"){
            return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"], "Only POST method is allowed")), { status: 405 });
        }
        const body = await req.json();
        console.log("Received object:", body);

        if (Object.keys(body).length === 0) 
        {
            return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "No fields found to insert")), { status: 400 });
        }

        const meme = new MemeImpl(body);
        console.log("Object Received:", meme);

        if (!meme.user_id || !meme.meme_title || !meme.image_url || !Array.isArray(meme.tags) || meme.tags.length === 0 ) 
        {
            return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing or invalid required fields")), { status: 400 });
        }

        if (meme.meme_title.length > 30  ) {
            return new Response(
                JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "meme_title exceeds character limit")),
                { status: 400 }
            );
        }



        // Validate each tag's length (e.g., max 50 characters per tag)
        for (const tag of meme.tags) {
            if (typeof tag !== "string" || tag.length >15 || tag.length <1 || tag.charAt(0) !='#') {
                return new Response(
                    
                    JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Invalid tag format")),
                    { status: 400 }
                );
            }
        }

        const response = await creatememeUsingbucketRepo(meme);

        if (response.status !== 201) {
            return new Response(
                JSON.stringify(new ApiResponseClass(response.status, response.message)),
                { status: response.status }
            );
        }

        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES.Created, ERROR_MESSAGES.Created)),
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in creatememeController: ", error);
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "An error occurred while processing your request", error)),
            { status: 500 }
        );
    }
}
