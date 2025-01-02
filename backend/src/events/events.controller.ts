import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
  Param,
  Patch,
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

  @Get(':id/participants')
  async getEventParticipants(@Param('id') eventId: string) {
    // TODO: Validate that 'eventId' is a valid UUID
    // TODO: Return 404 if the event does not exist
    return this.eventsService.getEventParticipants(eventId);
  }
}
