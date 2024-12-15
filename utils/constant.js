const customResourceResponse = {};

customResourceResponse.success = {
  statusCode: 200,
  message: "Request has been processed successfully",
};

customResourceResponse.created = {
  statusCode: 201,
  message: "Record has been created successfully",
};

customResourceResponse.jwtNotValid = {
  statusCode: 404,
  message: "Refresh token is not valid.Please sign in again",
};

customResourceResponse.register = {
  statusCode: 200,
  message: "Register successfully",
};

customResourceResponse.notValidId = {
  statusCode: 404,
  message: "Id is not valid",
};

customResourceResponse.recordNotFound = {
  statusCode: 404,
  message: "No Record found",
};

customResourceResponse.recordNotFoundOne = {
  statusCode: 404,
  message: "No Recod not found with that ID",
};

customResourceResponse.serverError = {
  statusCode: 500,
  message: "Internal server error",
};

customResourceResponse.validationError = {
  statusCode: 422,
  message: "Data validation failed",
};

export default customResourceResponse;
