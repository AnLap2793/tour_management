import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tour } from 'src/entities/tour.entity';
import { Booking } from 'src/entities/booking.entity';

export enum TourScheduleStatus {
  AVAILABLE = 'available',
  FULL = 'full',
  CANCELLED = 'cancelled',
}

@Entity('tourschedules')
export class TourSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tourId: number;

  @Column({ type: 'timestamp' })
  departureDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  returnDate: Date;

  @Column({ type: 'int' })
  availableSeats: number;

  @Column({ type: 'int' })
  maxSeats: number;

  @Column({ type: 'bigint' })
  basePrice: number;

  @Column({ type: 'bigint' })
  adultPrice: number;

  @Column({ type: 'bigint' })
  childPrice: number;

  @Column({ type: 'bigint' })
  infantPrice: number;

  @Column({ type: 'float', default: 1.0 })
  seasonalMultiplier: number;

  @Column({ type: 'float', default: 0 })
  specialDiscount: number;

  @Column({
    type: 'enum',
    enum: TourScheduleStatus,
    default: TourScheduleStatus.AVAILABLE,
  })
  status: TourScheduleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tour, (tour) => tour.tourSchedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @OneToMany(() => Booking, (booking) => booking.schedule, { cascade: true })
  bookings: Booking[];
}
