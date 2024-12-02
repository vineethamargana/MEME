export const HTTP_STATUS_CODES = {
  // 2xx Success
  "OK": 200,
  "Created": 201,
  "Accepted": 202,
  "No Content": 204,

  // 3xx Redirection
  "Moved Permanently": 301,
  "Found": 302,
  "Not Modified": 304,

  // 4xx Client Errors
  "Bad Request": 400,
  "Unauthorized": 401,
  "Forbidden": 403,
  "Not Found": 404,
  "Method Not Allowed": 405,
  "Conflict": 409,
  "Unprocessable Entity": 422,
  "Too Many Requests": 429,

  // 5xx Server Errors
  "Internal Server Error": 500,
  "Not Implemented": 501,
  "Bad Gateway": 502,
  "Service Unavailable": 503,
  "Gateway Timeout": 504,

  // Custom Application Codes
  "No Apply Job": 600, // Indicates that a job application could not be found or processed
  "No Data Found": 700, // Indicates an applicant could not be located
  "Provide All Fields": 800, // Indicates required fields are missing
  "Failed": 100, // General failure
  "Invalid Credentials": 4011, // Specific failure for incorrect login credentials
  "Account Locked": 4012, // Account has been locked due to policy
  "Data Conflict": 4091, // Conflict due to duplicate or inconsistent data
  "Resource Already Exists": 4092, // Attempt to create a duplicate resource
  "Validation Error": 4221, // Input validation failed
  "Rate Limit Exceeded": 4291, // Specific rate-limiting error
  "Temporary Maintenance": 5031 // Indicates temporary downtime
};
