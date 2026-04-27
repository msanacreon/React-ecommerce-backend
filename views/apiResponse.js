class ApiResponse {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message, statusCode = 500) {
    return {
      success: false,
      message,
      statusCode
    };
  }

  static validation(errors) {
    return {
      success: false,
      message: 'Validation failed',
      errors
    };
  }

  static notFound(resource = 'Resource') {
    return {
      success: false,
      message: `${resource} not found`,
      statusCode: 404
    };
  }

  static created(data, message = 'Created successfully') {
    return {
      success: true,
      message,
      data,
      statusCode: 201
    };
  }
}

module.exports = ApiResponse;
