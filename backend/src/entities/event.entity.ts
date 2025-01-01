import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { EventParticipant } from './event-participant.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => User, (user) => user.events)
  owner: User;

  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants: EventParticipant[];
}
