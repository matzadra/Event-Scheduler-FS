import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { typeOrmConfig } from './config/ormconfig';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { EventParticipant } from './entities/event-participant.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

import { DecodeTokenMiddleware } from './middleware/decodeToken.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), //DB connection configuration
    TypeOrmModule.forFeature([User, Event, EventParticipant]), // Entities to be used in the application
    JwtModule.register({
      secret: process.env.JWT_SECRET, // JWT secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    AuthModule,
    UsersModule,
    EventsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware) // Register the middleware to decode the JWT token
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply the middleware to all routes
  }
}
