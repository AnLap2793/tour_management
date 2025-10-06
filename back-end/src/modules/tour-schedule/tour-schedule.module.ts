import { Module } from '@nestjs/common';
import { TourScheduleService } from './tour-schedule.service';
import { TourScheduleController } from './tour-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourSchedule } from 'src/entities/tour-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourSchedule])],
  controllers: [TourScheduleController],
  providers: [TourScheduleService],
})
export class TourScheduleModule {}
