import unlikeMemeRepository from "../_repositories/unlikememerepo.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


export default async function unlikememecontroller(req:Request)
{
    try{
    if(req.method !== "DELETE")
    {
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"], "Only DELETE method is supported")),
            { status: 405 }
        );
    }
    const url = new URL(req.url);
    const meme_id = url.searchParams.get('meme_id');
    const user_id = url.searchParams.get('user_id');
    if (!meme_id) {
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing meme_id parameter")),
            { status: 400 }
        );
    }

    if (!user_id) {
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing user_id parameter")),
            { status: 403 }
        );
    }
   const result = await unlikeMemeRepository(meme_id, user_id);
   if(result.status !== 200)
   {
      return new Response(
        JSON.stringify(new ApiResponseClass(result.status, result.message)),
        { status: result.status }
      );
   }
   return new Response(JSON.stringify(new ApiResponseClass(result.status, result.message)), { status: result.status });
}
 catch(error){
    console.error("Error in likeMemeController: ", error);
    return new Response(
        JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "Unexpected error occurred", error)),
        { status: 500 }
    );
}
}