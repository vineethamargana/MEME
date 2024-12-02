export const ERROR_MESSAGES = {
  // General Success Messages
  OK: "The request was successful.",
  Created: "The resource was successfully created.",
  Accepted: "The request has been accepted for processing.",

  // Client Error Messages (4xx)
  BadRequest: "The request was invalid or missing required parameters.",
  Unauthorized: "Authentication is required or failed. Please log in.",
  Forbidden: "You do not have permission to access this resource.",
  NotFound: "The requested resource could not be found.",
  MethodNotAllowed: "Error:The HTTP method used is not allowed for this resource.",
  Conflict: "There was a conflict with the current state of the resource.",
  UnprocessableEntity: "The server cannot process the request due to semantic errors.",
  TooManyRequests: "Too many requests have been made in a short period. Please wait and try again.",

  // Server Error Messages (5xx)
  InternalServerError: "An error occurred on the server. Please try again later.",
  NotImplemented: "This feature is not yet implemented.",
  ServiceUnavailable: "The server is currently unavailable. Please try again later.",
  GatewayTimeout: "The server took too long to respond. Please try again.",

  // Custom Application Messages
  No_ApplyJob: "No applied jobs found for this applicant.",
  No_SavedJob: "No saved jobs found for this applicant.",
  InvalidInputData: "Invalid input data received. Please check the request body.",
  No_ApplicantFound: "No applicant found for the provided applicant_id.",
  ProvideAllRequiredFields: "Please provide all the required fields.",
  Failed: "The operation failed. Please try again.",
  Creation_Success: "Successfully created the applicant.",

  // Authentication and Authorization
  InvalidCredentials: "The provided credentials are invalid.",
  AccountLocked: "Your account has been locked due to multiple failed login attempts.",
  TokenExpired: "Your session has expired. Please log in again.",
  AccessDenied: "You do not have the necessary permissions to access this resource.",

  // Resource Management
  ResourceAlreadyExists: "The resource already exists.",
  ResourceNotFound: "The specified resource could not be found.",
  ResourceDeleted: "The resource has been deleted.",
  UpdateFailed: "Failed to update the resource. Please try again.",
  DeleteFailed: "Failed to delete the resource. Please try again.",
  FetchFailed: "Failed to retrieve the requested data. Please try again.",

  // Validation Errors
  ValidationError: "One or more fields failed validation. Please check your input.",
  MissingParameters: "Required parameters are missing. Please check your request.",
  InvalidFormat: "The provided data has an invalid format.",
  ExceedsLimit: "The provided data exceeds the allowed limit.",

  // Rate Limiting and Maintenance
  RateLimitExceeded: "You have exceeded the maximum allowed requests. Please try again later.",
  TemporaryMaintenance: "The system is undergoing maintenance. Please try again shortly."
};
