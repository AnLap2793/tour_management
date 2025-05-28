import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { Location } from 'src/entities/location.entity';
import { DepartureLocation } from 'src/entities/departure-location.entity';
import { TourSchedule } from 'src/entities/tour-schedule.entity';
import { Booking } from 'src/entities/booking.entity';
import { Review } from 'src/entities/review.entity';
import { TourImage } from 'src/entities/tour-image.entity';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'bigint', nullable: false, default: 0 })
  basePrice: number;

  @Column({ type: 'int', nullable: false })
  duration: number;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'int', nullable: false })
  locationId: number;

  @Column({ type: 'int', nullable: false })
  departureLocationId: number;

  @Column({ type: 'text', nullable: false })
  itinerary: string;

  @Column({ type: 'int', nullable: true })
  maxGroupSize: number;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations

  @ManyToOne(() => Category, (category) => category.tours)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Location, (location) => location.tours)
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @ManyToOne(
    () => DepartureLocation,
    (departureLocation) => departureLocation.tours,
  )
  @JoinColumn({ name: 'departureLocationId' })
  departureLocation: DepartureLocation;

  @OneToMany(() => TourSchedule, (tourSchedule) => tourSchedule.tour)
  tourSchedules: TourSchedule[];

  @OneToMany(() => Booking, (booking) => booking.tour)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.tour)
  reviews: Review[];

  @OneToMany(() => TourImage, (tourImage) => tourImage.tour)
  subImages: TourImage[];

  // Custom getter for full image URL (Sequelize `get()` alternative)
  get imageUrl(): string | null {
    if (!this.image) return null;
    return this.image.startsWith('http')
      ? this.image
      : `${process.env.BASE_URL}/uploads/${this.image}`;
  }
}
