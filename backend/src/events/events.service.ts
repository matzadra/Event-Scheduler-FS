import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createEvent(
    description: string,
    startTime: Date,
    endTime: Date,
    userId: string,
  ) {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be earlier than end time');
    }
    const overlappingEvent = await this.eventRepository.findOne({
      where: [
        { owner: { id: userId }, startTime: Between(startTime, endTime) },
        { owner: { id: userId }, endTime: Between(startTime, endTime) },
        {
          owner: { id: userId },
          startTime: LessThan(startTime),
          endTime: MoreThan(endTime),
        },
      ],
    });

    if (overlappingEvent) {
      if (startTime.getTime() === overlappingEvent.endTime.getTime()) {
        throw new BadRequestException('Events cannot be consecutive');
      }
      throw new BadRequestException('Event overlaps with an existing event');
    }

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create and save new event
    const newEvent = this.eventRepository.create({
      description,
      startTime,
      endTime,
      owner: user,
    });

    return this.eventRepository.save(newEvent);
  }

  async getEventsByUser(userId: string) {
    return this.eventRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
      select: {
        owner: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }
}
