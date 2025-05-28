import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Tour } from 'src/entities/tour.entity';
import { TourSchedule } from 'src/entities/tour-schedule.entity';

@Entity('bookings')
@Unique(['transactionId'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  tourId: number;

  @Column()
  scheduleId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  bookingDate: Date;

  @Column({ type: 'int', default: 0 })
  numberOfAdults: number;

  @Column({ type: 'int', default: 0 })
  numberOfChildren: number;

  @Column({ type: 'int', default: 0 })
  numberOfInfants: number;

  @Column({ type: 'bigint', comment: 'Total price in VND' })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  })
  paymentStatus: 'pending' | 'paid' | 'failed';

  @Column({
    type: 'enum',
    enum: ['vnpay', 'momo', 'zalopay'],
    default: 'vnpay',
  })
  paymentMethod: 'vnpay' | 'momo' | 'zalopay';

  @Column({ nullable: true })
  transactionId: string;

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // --- Relations ---
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Tour, (tour) => tour.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @ManyToOne(() => TourSchedule, (schedule) => schedule.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scheduleId' })
  schedule: TourSchedule;
}
