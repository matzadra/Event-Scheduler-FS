import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
@UseGuards(AuthGuard('jwt')) // protect all routes in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(name, email, password);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Req() req,
    @Body('name') name?: string,
    @Body('email') email?: string,
    @Body('password') password?: string,
  ) {
    const userId = req.user.userId; // get the user ID from the request
    return this.usersService.updateUser(id, { name, email, password }, userId);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId; // get the user ID from the request
    return this.usersService.deleteUser(id, userId);
  }
}
