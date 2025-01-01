import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { EventParticipant } from './event-participant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Event, (event) => event.owner)
  events: Event[];

  @OneToMany(() => EventParticipant, (participant) => participant.user)
  invitations: EventParticipant[];
}
