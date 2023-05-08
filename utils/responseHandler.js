function successResponse(data, message = null) {
  return {
    success: true,
    data,
    message,
  };
}

function errorResponse(errorCode, errorMessage) {
  return {
    success: false,
    data: null,
    errorCode,
    errorMessage,
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
