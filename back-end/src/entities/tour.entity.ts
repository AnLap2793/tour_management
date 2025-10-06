import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Category } from './category.entity';
import { Location } from './location.entity';
import { DepartureLocation } from './departure-location.entity';
import { TourSchedule } from './tour-schedule.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
import { TourImage } from './tour-image.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('tours')
export class Tour {
  @PrimaryColumn()
  id: string = uuidv4();

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

  @Column({ type: 'varchar', nullable: false })
  categoryId: string;

  @Column({ type: 'varchar', nullable: false })
  locationId: string;

  @Column({ type: 'varchar', nullable: false })
  departureLocationId: string;

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
