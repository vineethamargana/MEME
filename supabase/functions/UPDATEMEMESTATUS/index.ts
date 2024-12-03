import updateMemeStatus from "../_controllers/updatememestatuscontroller.ts";
import { ERROR_MESSAGES } from "../_shared/_constants/ErrorMessages.ts";
import { HttpMethod } from "../_shared/_constants/HttpMethods.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    if(req.method === HttpMethod.PATCH)
    {
       return await updateMemeStatus(req);
    }
    return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"],ERROR_MESSAGES.MethodNotAllowed)),{status: 404})
  }
  catch (error) {
    console.error("Unexpected error: ", error);
    return new Response(
      JSON.stringify(
        new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], ERROR_MESSAGES.InternalServerError, error)
      ), 
      { status: 500 }
    );
  }
})