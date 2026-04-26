import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ok } from '../common/api-response';
import { UsersService } from './users.service';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  institution?: string;
  role?: UserRole;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  institution?: string | null;
  role?: UserRole;
  isActive?: boolean;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return ok(data);
  }

  @Post()
  async create(@Body() body: CreateUserRequest) {
    const data = await this.usersService.create(body);
    return ok(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserRequest) {
    const data = await this.usersService.update(id, body);
    return ok(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(id);
    return ok(data);
  }
}
