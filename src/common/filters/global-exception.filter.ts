import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ResponseHelper } from "../helpers/response.helper";
import { RESPONSE_MESSAGES } from "../constants/response.constants";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let error: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else {
        message = (exceptionResponse as any).message || exception.message;
        error = {
          code: exception.name,
          details: exceptionResponse,
        };
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = RESPONSE_MESSAGES.COMMON.INTERNAL_ERROR;
      error = {
        code: "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? exception : undefined,
      };
    }

    const errorResponse = ResponseHelper.error(message, error);

    response.status(status).json(errorResponse);
  }
}
