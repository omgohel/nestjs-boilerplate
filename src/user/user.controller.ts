// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { User } from "src/user/user.entity";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "src/common/decorators/response.decorator";
import { RESPONSE_MESSAGES } from "src/common/constants/response.constants";
import { ApiResponse } from "src/common/interfaces/response.interface";
import { ResponseHelper } from "src/common/helpers/response.helper";
import { UserResponseDto } from "./dto/user-response.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/user-query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("Users")
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiSuccessResponse(UserResponseDto, {
    description: RESPONSE_MESSAGES.USER.CREATED,
  })
  @ApiErrorResponse(HttpStatus.CONFLICT, RESPONSE_MESSAGES.USER.EMAIL_EXISTS)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.create(createUserDto);
    return ResponseHelper.success(user, RESPONSE_MESSAGES.USER.CREATED);
  }

  @Get()
  @ApiOperation({ summary: "Get all users with pagination and filters" })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search by name or email",
  })
  @ApiQuery({ name: "role", required: false, enum: ["user", "admin"] })
  @ApiQuery({ name: "isActive", required: false, type: "boolean" })
  @ApiQuery({ name: "page", required: false, type: "number", example: 1 })
  @ApiQuery({ name: "limit", required: false, type: "number", example: 10 })
  @ApiSuccessResponse(UserResponseDto, {
    description: RESPONSE_MESSAGES.USER.FETCHED,
    isArray: true,
    hasPagination: true,
  })
  async findAll(@Query() queryDto: QueryUserDto): Promise<ApiResponse<User[]>> {
    const result = await this.userService.findAll(queryDto);
    return ResponseHelper.success(
      result.data,
      RESPONSE_MESSAGES.USER.FETCHED,
      result.meta,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiSuccessResponse(UserResponseDto, {
    description: RESPONSE_MESSAGES.USER.FOUND,
  })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, RESPONSE_MESSAGES.USER.NOT_FOUND)
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.findOne(id);
    return ResponseHelper.success(user, RESPONSE_MESSAGES.USER.FOUND);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user by ID" })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiSuccessResponse(UserResponseDto, {
    description: RESPONSE_MESSAGES.USER.UPDATED,
  })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, RESPONSE_MESSAGES.USER.NOT_FOUND)
  @ApiErrorResponse(HttpStatus.CONFLICT, RESPONSE_MESSAGES.USER.EMAIL_TAKEN)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.update(id, updateUserDto);
    return ResponseHelper.success(user, RESPONSE_MESSAGES.USER.UPDATED);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete user by ID" })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiSuccessResponse(UserResponseDto, {
    description: RESPONSE_MESSAGES.USER.DELETED,
  })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, RESPONSE_MESSAGES.USER.NOT_FOUND)
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<null>> {
    await this.userService.remove(id);
    return ResponseHelper.success(null, RESPONSE_MESSAGES.USER.DELETED);
  }

  @Post(":id/restore")
  @ApiOperation({ summary: "Restore soft deleted user" })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiSuccessResponse(UserResponseDto, {
    description: RESPONSE_MESSAGES.USER.RESTORED,
  })
  async restore(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.restore(id);
    return ResponseHelper.success(user, RESPONSE_MESSAGES.USER.RESTORED);
  }

  @Post(":id/change-password")
  @ApiOperation({ summary: "Change user password" })
  @ApiParam({ name: "id", description: "User UUID" })
  @ApiSuccessResponse(UserResponseDto, {
    description: RESPONSE_MESSAGES.USER.PASSWORD_CHANGED,
  })
  @ApiErrorResponse(
    HttpStatus.BAD_REQUEST,
    RESPONSE_MESSAGES.USER.INVALID_OLD_PASSWORD,
  )
  async changePassword(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() changePasswordDto: { oldPassword: string; newPassword: string },
  ): Promise<ApiResponse<null>> {
    await this.userService.changePassword(
      id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
    return ResponseHelper.success(
      null,
      RESPONSE_MESSAGES.USER.PASSWORD_CHANGED,
    );
  }
}
