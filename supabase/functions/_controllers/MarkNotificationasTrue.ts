import markNotifications from "../_repositories/markNotificatonRepo.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


export default async function markNotification(req:Request)
{
    try{
        if(req.method  !== 'PATCH')
        {
            return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"], "Only PATCH method is supported")), { status: 405 });
        }
        const url = new URL(req.url);
        const notification_id = url.searchParams.get('notification_id');
        if(!notification_id)
            {
                return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Missing notification_id parameter")), { status: 400 });
            }
        
        const response = await markNotifications(notification_id);
        if(response.status === 200)
        {
            return new Response(JSON.stringify(new ApiResponseClass(response.status, response.message)), { status: response.status });
        }

        return new Response(JSON.stringify(new ApiResponseClass(response.status, response.message)), { status: response.status });

    }
    catch(error)
    {
        console.error("Error occurred while parsing request", error);
        return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "An error occurred while processing your request")), { status: 500 });
    }
}