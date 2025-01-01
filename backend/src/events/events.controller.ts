import { Controller, Post, Get, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
//import { AuthGuard } from '@nestjs/passport';

@Controller('events')
//@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  //@Req() req,
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    //const userId = req.user.id;
    const { description, startTime, endTime } = createEventDto;
    const userId = 'd54f60aa-9d61-4d0b-91e2-430b6039b9ae'; // hardcoded for now

    return this.eventsService.createEvent(
      description,
      new Date(startTime),
      new Date(endTime),
      userId,
    );
  }

  @Get()
  async getEvents() {
    const userId = 'd54f60aa-9d61-4d0b-91e2-430b6039b9ae'; // Mock user
    return this.eventsService.getEventsByUser(userId);
  }
}
