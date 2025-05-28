import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from 'src/entities/tour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tour])],
  controllers: [TourController],
  providers: [TourService],
})
export class TourModule {}
