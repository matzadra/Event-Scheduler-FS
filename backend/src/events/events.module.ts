import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventParticipant } from 'src/entities/event-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, EventParticipant])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
