export class ApiError extends Error {
  public statusCode: number;
  public errors?: any;

  constructor(message: string, statusCode = 500, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }

  public static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }

  public static notFound(message = 'Not Found') {
    return new ApiError(message, 404);
  }

  public static badRequest(message = 'Bad Request', errors?: any) {
    return new ApiError(message, 400, errors);
  }

  public static tooManyRequests(message = 'Too Many Requests') {
    return new ApiError(message, 429);
  }

  public static internal(message = 'Internal Server Error') {
    return new ApiError(message, 500);
  }
}
