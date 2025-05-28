import { Module } from '@nestjs/common';
import { TourImageService } from './tour-image.service';
import { TourImageController } from './tour-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourImage } from 'src/entities/tour-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourImage])],
  controllers: [TourImageController],
  providers: [TourImageService],
})
export class TourImageModule {}
