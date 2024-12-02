import { HttpMethod } from "../_shared/_constants/HttpMethods.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";
import getmemebyIDController from "../_controllers/getmemebyidcontroller.ts";

Deno.serve(async (req) => {
    try {
        const method = req.method;
        if (method === HttpMethod.GET) {
            return await getmemebyIDController(req);
        }

        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Method not allowed")),
            { status: 405 }
        );
    } catch (error) {
        console.error("Unexpected error: ", error);
        return new Response(
            JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], "Unexpected error occurred", error)),
            { status: 500 }
        );
    }
});
