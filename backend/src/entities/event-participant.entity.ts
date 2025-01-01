import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity()
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.participants)
  event: Event;

  @ManyToOne(() => User, (user) => user.invitations)
  user: User;

  @Column({ default: 'pending' })
  status: string; // pending, accepted, rejected
}
