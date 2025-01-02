import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan, Not } from 'typeorm';
import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { EventParticipant } from '../entities/event-participant.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>,
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

  async updateEvent(
    eventId: string,
    updateEventDto: Partial<CreateEventDto>,
    userId: string,
  ) {
    // Busca o evento, garantindo que ele pertence ao usuário autenticado
    const event = await this.eventRepository.findOne({
      where: { id: eventId, owner: { id: userId } },
      relations: ['owner'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (updateEventDto.description) {
      event.description = updateEventDto.description;
    }
    if (updateEventDto.startTime) {
      event.startTime = new Date(updateEventDto.startTime);
    }
    if (updateEventDto.endTime) {
      event.endTime = new Date(updateEventDto.endTime);
    }
    if (event.startTime >= event.endTime) {
      throw new BadRequestException('Start time must be earlier than end time');
    }
    //overlapping events check
    const overlappingEvent = await this.eventRepository.findOne({
      where: [
        {
          owner: { id: userId },
          startTime: LessThan(event.endTime),
          endTime: MoreThan(event.startTime),
          id: Not(eventId), // Exclude the current event from the query
        },
      ],
    });
    if (overlappingEvent) {
      throw new BadRequestException('Event overlaps with an existing event');
    }
    return this.eventRepository.save(event);
  }

  async deleteEvent(eventId: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, owner: { id: userId } },
      relations: ['owner'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    await this.eventRepository.delete(eventId);
  }

  async inviteUser(eventId: string, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['owner'],
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.owner.id === userId)
      throw new BadRequestException('Cannot invite yourself');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const invitation = this.eventParticipantRepository.create({
      event,
      user,
      status: 'pending',
    });
    return this.eventParticipantRepository.save(invitation);
  }

  async updateInviteStatus(
    eventId: string,
    inviteId: string,
    status: 'accepted' | 'rejected',
  ) {
    const invitation = await this.eventParticipantRepository.findOne({
      where: { id: inviteId, event: { id: eventId } },
      relations: ['event', 'user'],
    });
    if (!invitation) throw new NotFoundException('Invitation not found');

    invitation.status = status;
    return this.eventParticipantRepository.save(invitation);
  }

  async getEventParticipants(eventId: string) {
    const participants = await this.eventParticipantRepository.find({
      where: { event: { id: eventId }, status: 'accepted' },
      relations: ['user'],
    });
    return participants.map((p) => ({
      id: p.user.id,
      name: p.user.name,
      email: p.user.email,
    }));
  }

  async getReceivedInvites(userId: string) {
    return this.eventParticipantRepository.find({
      where: { user: { id: userId }, status: 'pending' },
      relations: ['event', 'event.owner'],
    });
  }

  async getSentInvites(userId: string) {
    return this.eventParticipantRepository.find({
      where: { event: { owner: { id: userId } } },
      relations: ['event', 'user'],
    });
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
