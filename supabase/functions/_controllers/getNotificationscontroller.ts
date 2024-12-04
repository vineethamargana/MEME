import getnotificationsRepo from "../_repositories/getNotificationsRepo.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


export default async function getNotifications(req:Request)
{
    try{
        const url = new URL(req.url);
    if(req.method  !== 'GET')
    {
        return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"], "Only GET method is supported")), { status: 405 });
    }

    const user_id = url.searchParams.get('user_id');
    if(!user_id)
    {
        return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing user_id parameter")), { status: 400 });
    }
   
    const result = await getnotificationsRepo(user_id);
    if(result.status !== 200) {
        if(result.status !== 200)
            {
               return new Response(
                 JSON.stringify(new ApiResponseClass(result.status, result.message)),
                 { status: result.status }
               );
            }
    }
    return new Response(JSON.stringify((result.status,result.message,result.data)), { status: result.status });
    }

    catch(error){
        return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "An error occurred while processing your request",error)), { status: 500 });
    }
}