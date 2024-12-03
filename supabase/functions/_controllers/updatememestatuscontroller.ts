import updateMemeStatusRepo from "../_repositories/updatememestatusrepo.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


export default async function updateMemeStatus(req: Request)
{
   try{
    if(req.method !== 'PATCH')
    {
      return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"], "Method not allowed")), { status: 405 });
    }
    const url = new URL(req.url);
    const meme_id = url.searchParams.get('meme_id');

    if (!meme_id) {
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing meme_id parameter")),
            { status: 400 }
        );
    }
   
    const body = await req.json();
    if (!body.meme_status ) {
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing status parameter")),
            { status: 400 }
        );
    }

    const response = await updateMemeStatusRepo(meme_id, body.meme_status);

    // Step 3: Return the response based on repository execution
    if (response.status === 200) {
      return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["OK"],response.message)),{ status: 200 });
    }

    return new Response(JSON.stringify(new ApiResponseClass( response.status,response.message)),{ status: response.status });
  } 
  catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify(new ApiResponseClass( HTTP_STATUS_CODES["Internal Server Error"],"An unexpected error occurred.")),{ status: 500 });
  }
}
