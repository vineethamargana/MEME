import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


export default async function updateMemeStatus(req: Request)
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
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Forbidden"], "User not authorized to access please provide userid")),
            { status: 403 }
        );
    }
   
    const body = await req.json();
    if (!body.status ) {
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing status parameter")),
            { status: 400 }
        );
    }

    const updatedMeme = await updateMemeStatusRepo(meme_id, user_id, body.status);



}


}