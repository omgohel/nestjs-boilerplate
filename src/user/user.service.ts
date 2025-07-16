import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import * as bcrypt from "bcrypt";
import { RESPONSE_MESSAGES } from "src/common/constants/response.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/user-query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(RESPONSE_MESSAGES.USER.EMAIL_EXISTS);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(queryDto: QueryUserDto) {
    const { search, role, isActive, page, limit } = queryDto;

    const queryBuilder = this.userRepository.createQueryBuilder("user");

    // Add search conditions
    if (search) {
      queryBuilder.where(
        "(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere("user.role = :role", { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere("user.isActive = :isActive", { isActive });
    }

    const skip = ((page || 1) - 1) * (limit || 10);
    queryBuilder.skip(skip).take(limit);

    // Add ordering
    queryBuilder.orderBy("user.createdAt", "DESC");

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / (limit || 10)),
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException(RESPONSE_MESSAGES.USER.EMAIL_TAKEN);
      }
    }

    // Update user
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<User> {
    await this.userRepository.restore(id);
    return await this.findOne(id);
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ["id", "password"],
    });

    if (!user) {
      throw new NotFoundException(RESPONSE_MESSAGES.USER.NOT_FOUND);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException(
        RESPONSE_MESSAGES.USER.INVALID_OLD_PASSWORD,
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashedNewPassword });
  }
}
