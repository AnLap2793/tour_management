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

@Entity('categories')
@Unique(['name'])
@Unique(['slug'])
export class Category {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;

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
  @OneToMany(() => Tour, (tour) => tour.category)
  tours: Tour[];

  // Computed getter (emulated manually)
  get imageUrl(): string | null {
    if (!this.image) return null;
    return this.image.startsWith('http')
      ? this.image
      : `${process.env.BASE_URL}/uploads/${this.image}`;
  }
}
