import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
