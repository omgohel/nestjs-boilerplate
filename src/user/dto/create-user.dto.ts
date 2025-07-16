import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { PartialType, OmitType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";

export class CreateUserDto {
  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: "User password",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "User phone number",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: "User role",
    example: "user",
    enum: ["user", "admin"],
    default: "user",
  })
  @IsOptional()
  @IsEnum(["user", "admin"])
  role?: string;

  @ApiProperty({
    description: "User active status",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
