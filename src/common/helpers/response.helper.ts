import { ApiResponse, SuccessResponse, ErrorResponse } from '../interfaces/response.interface';

export class ResponseHelper {
  static success<T>(
    data: T,
    message: string,
    meta?: { total?: number; page?: number; limit?: number; totalPages?: number }
  ): SuccessResponse<T> {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return response;
  }

  static error(
    message: string,
    error?: { code?: string; details?: any }
  ): ErrorResponse {
    const response: ErrorResponse = {
      success: false,
      message,
    };

    if (error) {
      response.error = error;
    }

    return response;
  }
}