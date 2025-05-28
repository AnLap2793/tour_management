import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Tour } from './tour.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('locations')
@Unique(['name'])
export class Location {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'int', default: 0 })
  popularityScore: number;

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
  @OneToMany(() => Tour, (tour) => tour.location)
  tours: Tour[];

  // Custom getter for image URL
  get imageUrl(): string | null {
    if (!this.image) return null;
    return this.image.startsWith('http')
      ? this.image
      : `${process.env.BASE_URL}/uploads/${this.image}`;
  }
}
