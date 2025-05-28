import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tour } from './tour.entity';
import { v4 as uuidv4 } from 'uuid';
@Entity('tour_images')
export class TourImage {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  tourId: number;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tour, (tour) => tour.subImages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  // Getter để trả về URL đầy đủ cho ảnh (tương tự Sequelize get())
  get imageUrl(): string | null {
    if (!this.image) return null;
    return this.image.startsWith('http')
      ? this.image
      : `${process.env.BASE_URL}/uploads/${this.image}`;
  }
}
