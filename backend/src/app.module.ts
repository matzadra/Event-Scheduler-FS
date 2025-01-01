import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // Database connection
    AuthModule, // Authentication module
    UsersModule, // User management module
    EventsModule, // Event management module
  ],
})
export class AppModule {}
