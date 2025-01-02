import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { User } from './user.entity';

@Entity()
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.participants, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @ManyToOne(() => User, (user) => user.invitations, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}
