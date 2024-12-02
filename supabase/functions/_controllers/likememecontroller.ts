import likeMemeRepository from "../_repositories/likememeRepo.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


export default async function likememecontroller(req:Request)
{
    try{
    const url = new URL(req.url);
    const meme_id = url.searchParams.get('meme_id');
    const user_id = req.headers.get('user_id');
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
   const result = await likeMemeRepository(meme_id, user_id);
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