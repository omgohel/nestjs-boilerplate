import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: {
    description?: string;
    isArray?: boolean;
    hasPagination?: boolean;
  }
) => {
  const { description = 'Success', isArray = false, hasPagination = false } = options || {};

  const dataSchema = isArray
    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
    : { $ref: getSchemaPath(model) };

  const responseSchema = {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: description },
      data: dataSchema,
      ...(hasPagination && {
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 },
          },
        },
      }),
    },
  };

  return applyDecorators(
    ApiResponse({
      status: 200,
      description,
      schema: responseSchema,
    })
  );
};

export const ApiErrorResponse = (
  status: number,
  description: string,
  errorCode?: string
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: description },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: errorCode || 'ERROR' },
              details: { type: 'object' },
            },
          },
        },
      },
    })
  );
};