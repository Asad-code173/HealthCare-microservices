import type { IApiError } from '../types/ApiErrorResponse.js';
class ApiError extends Error implements IApiError {
  statusCode: number;
  errors: string[];
  success: boolean;
  stack?: string;

  constructor(
    statusCode: number,
    message: string,
    errors: string[] = [],
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.message=message
    this.success = false;

    // Assign stack if provided, otherwise capture it
    if (stack) {
      this.stack = stack;
    } else {
      // Fix prototype chain for TypeScript
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export { ApiError };
