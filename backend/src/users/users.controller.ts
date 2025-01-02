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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dot';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //open route to create a user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  //protected route to get all users
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // protected route to update a user
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Param('id') id: string,
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.userId;
    return this.usersService.updateUser(id, updateUserDto, userId);
  }

  // protected route to delete a user
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.usersService.deleteUser(id, userId);
  }
}
