
import updateMemebyId from "../_controllers/updatememecontroller.ts"
import { HttpMethod } from "../_shared/_constants/HttpMethods.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";

Deno.serve(async (req) => {
    try {
        if (req.method !== HttpMethod.PATCH) {
          return new Response(JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Method not allowed")), { status: 405 });
        }

        return await updateMemebyId(req);
  
    } catch (error) {
        console.error("Server Error:", error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error", error: error }),
            { status: 500 }
        );
    }
});

