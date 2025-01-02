import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/ormconfig';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { EventParticipant } from './entities/event-participant.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // DB connection configuration
    TypeOrmModule.forFeature([User, Event, EventParticipant]), // Entities registration
    AuthModule,
    UsersModule,
    EventsModule,
  ],
})
export class AppModule {}
