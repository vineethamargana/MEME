import likememecontroller from "../_controllers/likememecontroller.ts";
import { ERROR_MESSAGES } from "../_shared/_constants/ErrorMessages.ts";
import { HttpMethod } from "../_shared/_constants/HttpMethods.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";



Deno.serve(async(req)=>{
  const method = req.method;
  try{
    if(method === HttpMethod.POST)
      {
        return await likememecontroller(req);
      }
    return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"],"method not allowed")),{status:405})
  }
  catch(error){
    return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], ERROR_MESSAGES.InternalServerError,error)),{status:500})
  }

})