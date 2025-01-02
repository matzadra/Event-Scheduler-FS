import { Controller, Post, Get, UseGuards, Req, Body } from '@nestjs/common';
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
}
