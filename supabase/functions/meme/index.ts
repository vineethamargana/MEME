import creatememeController2 from "../_controllers/creatememeuploadimagecontroller.ts";
import DeletememebyID from "../_controllers/DeleteMemeController.ts";
import getAllMemes from "../_controllers/getAllMemes.ts";
import getmemebyIDController from "../_controllers/getmemebyidcontroller.ts";
import getNotifications from "../_controllers/getNotificationscontroller.ts";
import likememecontroller from "../_controllers/likememecontroller.ts";
import markNotification from "../_controllers/MarkNotificationasTrue.ts";
import unlikememecontroller from "../_controllers/unlinkememecontroller.ts";
import updateMemebyId from "../_controllers/updatememecontroller.ts";
import updateMemeStatus from "../_controllers/updatememestatuscontroller.ts";
// import { ERROR_MESSAGES } from "../_shared/_constants/ErrorMessages.ts";
// import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
// import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";

// Define the available route handlers
const routeHandlers = {
  creatememe: creatememeController2,
  updatememe: updateMemebyId,
  deletememe: DeletememebyID,
  getallmemes111: getAllMemes,
  getmemebyid: getmemebyIDController,
  likememe: likememecontroller,
  unlike: unlikememecontroller,
  updatestatus: updateMemeStatus,
  getnotifications: getNotifications,
  marknotification: markNotification
};

// Main handler for requests 
Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const rawPath = url.pathname;
    console.log(`search params: ${url.searchParams}`);
    const queryParams = Object.fromEntries(url.searchParams);
    console.log(`query params: ${queryParams}`);

    console.log(`Incoming Request URL: ${req.url}`);
    console.log(`Raw Path: ${rawPath}`);
    console.log(`Query Parameters: ${JSON.stringify(queryParams)}`);

    // Iterate through the handlers to see if the path contains any of the route keywords
    for (const [keyword, handler] of Object.entries(routeHandlers)) {
      if (rawPath.includes(keyword)) {
        console.log(`Matched Route: ${keyword}`);
        return await handler(req);
      }
    }

    // If no matching route is found
    console.error(`No handler found for path: ${rawPath}`);
    return new Response(
      JSON.stringify({
        statusCode: 404,
        message: "Route not found",
        time: new Date().toISOString(),
      }),
      { status: 404 }
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: "Internal Server Error",
        error: error,
        time: new Date().toISOString(),
      }),
      { status: 500 }
    );
  }
});
