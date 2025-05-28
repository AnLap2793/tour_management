import { Module } from '@nestjs/common';
import { DepartureLocationService } from './departure-location.service';
import { DepartureLocationController } from './departure-location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartureLocation } from 'src/entities/departure-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepartureLocation])],
  controllers: [DepartureLocationController],
  providers: [DepartureLocationService],
})
export class DepartureLocationModule {}
