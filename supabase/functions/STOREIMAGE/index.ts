import { ApiResponseClass } from "../ApiResponse/ApiResponse.ts";
import supabase from "../_shared/_config/supabaseClient.ts";
import { ERROR_MESSAGES } from "../_shared/_constants/ErrorMessages.ts";
import { HTTP_STATUS_CODES } from "../_shared/_constants/StatusCodes.ts";
import { HttpMethod } from "../_shared/_constants/HttpMethods.ts";

Deno.serve(async (req) => {
  //Check if Authorization header is present
  // const authHeader = req.headers.get("Authorization");
  // console.log(authHeader);
  // if (!authHeader) {
  //   console.log("1 error occurred");
  //   return new Response(
  //     JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES.Forbidden, ERROR_MESSAGES.AccessDenied)),
  //     { status: 403 }
  //   );
  // }

  // // Extract token from Authorization header
  // const token = authHeader.replace("Bearer", "").trim();
  // console.log(token);


  // Validate token with Supabase
  // const { data: user, error: authError } = await supabase.auth.getUser(token);
  // if (authError || !user) {
  //   return new Response(
  //     JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES.Forbidden, ERROR_MESSAGES.AccessDenied)),
  //     { status: 403 }
  //   );
  // }

  // Proceed with the file upload if the method is POST
  if (req.method !== HttpMethod.POST) {
    return new Response(
      JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Method Not Allowed"], ERROR_MESSAGES.BadRequest)),
      { status: 405 }
    );
  }

  // Handle file upload
  const formData = await req.formData();
  console.log(formData);
  const file = formData.get("file") as File;
  if (!file) {
    return new Response(
      JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "No file data found in the request")),
      { status: 400 }
    );
  }

  const allowedMimeTypes = ["image/jpeg", "image/png"];
  if (!allowedMimeTypes.includes(file.type)) {
    return new Response(
      JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "Invalid file type. Only PNG and JPEG are allowed.")),
      { status: 400 }
    );
  }

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxFileSize) {
    return new Response(
      JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES["Bad Request"], "File size exceeds 5MB limit")),
      { status: 400 }
    );
  }

  // Define the bucket name and file path
  const bucketName = "memes";
  const filePath = `memes/${Date.now()}-${file.name}`;

  // Upload the file to Supabase
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(filePath, file.stream(), {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    return new Response(
      JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES.Failed, "File upload failed. Please try again.")),
      { status: 500 }
    );
  }

  // Get the public URL for the uploaded file
  const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  if (!publicData?.publicUrl) {
    return new Response(
      JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES.Failed, "Error generating public URL. Please contact support.")),
      { status: 500 }
    );
  }

  const publicURL = publicData.publicUrl;

  return new Response(
    JSON.stringify(new ApiResponseClass(HTTP_STATUS_CODES.OK, "File uploaded successfully", { image_url: publicURL })),
    { status: 200 }
  );
});
