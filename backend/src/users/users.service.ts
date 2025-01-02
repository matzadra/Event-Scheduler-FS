import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...rest }) => rest);
  }

  async updateUser(id: string, data: Partial<User>, userId: string) {
    if (id !== userId) {
      throw new ForbiddenException('You can only update your own data');
    }

    if (data.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ForbiddenException('Email already in use');
      }
    }

    await this.userRepository.update(id, data);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedUser;
    return rest;
  }

  async deleteUser(id: string, userId: string) {
    //TODO: implement error when user has events
    if (id !== userId) {
      throw new ForbiddenException('You can only delete your own account');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async createUser(name: string, email: string, password: string) {
    // Check if email is already in use
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Create and save new user
    const newUser = this.userRepository.create({ name, email, password });
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
