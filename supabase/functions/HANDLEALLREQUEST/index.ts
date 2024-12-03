import creatememeController2 from "../_controllers/creatememeuploadimagecontroller.ts";
import DeletememebyID from "../_controllers/DeleteMemeController.ts";
import getAllMemes from "../_controllers/getAllMemes.ts";
import getmemebyIDController from "../_controllers/getmemebyidcontroller.ts";
import likememecontroller from "../_controllers/likememecontroller.ts";
import unlikememecontroller from "../_controllers/unlinkememecontroller.ts";
import updateMemebyId from "../_controllers/updatememecontroller.ts";
import updateMemeStatus from "../_controllers/updatememestatuscontroller.ts";
import { ERROR_MESSAGES } from "../_shared/_constants/ErrorMessages.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";


Deno.serve(async (req: Request) => {
  // Get the method (GET, POST, etc.) and path of the request
  const  url  = new URL(req.url)
  const path=url.pathname.split('/');
  const endUrl=path[path.length-1];

  // Check the type of request based on the URL or method
  if (path[path.length-1] === 'creatememe') 
  {
       console.log("Create meme start")
       return await creatememeController2(req);
  }
  else if (path[path.length-2] === 'upadatememe' ) 
  {
    console.log("Update meme start")
    return await updateMemebyId(req);
  
  }
  else if (endUrl === 'deletememe' ) 
  {
    return await DeletememebyID(req);
  } 
  else if (endUrl === 'getallmemes' ) 
  {
      return await getAllMemes(req);
  } 
  else if (endUrl === 'getmemebyid' ) 
  {
      return await getmemebyIDController(req)
  } 
  else if (endUrl === 'likememe' ) 
  {
      return await likememecontroller(req)
  } 
  else if (endUrl === 'unlikememe' ) 
  {
      return await unlikememecontroller(req)
  } 
  else if (endUrl === 'updatememestatus')
  {
     return await updateMemeStatus(req);
  }
  else 
  {
    console.log("Route not found or method not allowed")
    return new Response(
      JSON.stringify(
          new ApiResponseClass(HTTP_STATUS_CODES["Internal Server Error"], ERROR_MESSAGES.InternalServerError)
      ), 
      { status: 500 }
  );
  }
});