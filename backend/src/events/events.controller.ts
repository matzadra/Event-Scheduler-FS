import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('events')
@UseGuards(AuthGuard('jwt')) // Protect all routes in this controller
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto, @Req() req) {
    const { description, startTime, endTime } = createEventDto;
    const userId = req.user.userId;

    return this.eventsService.createEvent(
      description,
      new Date(startTime),
      new Date(endTime),
      userId,
    );
  }

  @Get()
  async getEvents(@Req() req) {
    const userId = req.user.userId;
    return this.eventsService.getEventsByUser(userId);
  }

  @Post(':id/invite')
  async inviteUserToEvent(
    @Param('id') eventId: string,
    @Body('userId') userId: string,
  ) {
    return this.eventsService.inviteUser(eventId, userId);
  }

  @Patch(':eventId/invite/:inviteId')
  async updateInviteStatus(
    @Param('eventId') eventId: string,
    @Param('inviteId') inviteId: string,
    @Body('status') status: 'accepted' | 'rejected',
  ) {
    // TODO: Validate 'status' to only accept 'accepted' or 'rejected'
    return this.eventsService.updateInviteStatus(eventId, inviteId, status);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') eventId: string,
    @Body() updateEventDto: Partial<CreateEventDto>,
    @Req() req,
  ) {
    const userId = req.user.userId; // ID do usuário autenticado
    return this.eventsService.updateEvent(eventId, updateEventDto, userId);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') eventId: string, @Req() req) {
    const userId = req.user.userId; // ID do usuário autenticado
    return this.eventsService.deleteEvent(eventId, userId);
  }

  @Get(':id/participants')
  async getEventParticipants(@Param('id') eventId: string) {
    // TODO: Validate that 'eventId' is a valid UUID
    // TODO: Return 404 if the event does not exist
    return this.eventsService.getEventParticipants(eventId);
  }

  @Get('/rsvp')
  @UseGuards(AuthGuard('jwt'))
  async getRSVPs(@Req() req) {
    const userId = req.user.userId;
    const received = await this.eventsService.getReceivedInvites(userId);
    const sent = await this.eventsService.getSentInvites(userId);

    return {
      received: received.map((invite) => ({
        id: invite.id,
        event: {
          id: invite.event.id,
          description: invite.event.description,
          startTime: invite.event.startTime,
          endTime: invite.event.endTime,
        },
        inviter: {
          id: invite.event.owner.id,
          name: invite.event.owner.name,
        },
        status: invite.status,
      })),
      sent: sent.map((invite) => ({
        id: invite.id,
        event: {
          id: invite.event.id,
          description: invite.event.description,
          startTime: invite.event.startTime,
          endTime: invite.event.endTime,
        },
        recipient: {
          id: invite.user.id,
          name: invite.user.name,
        },
        status: invite.status,
      })),
    };
  }
}
