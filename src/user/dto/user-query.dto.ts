import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class QueryUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(["user", "admin"])
  role?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
