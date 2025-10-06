import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourModule } from './modules/tour/tour.module';
import { BookingModule } from './modules/booking/booking.module';
import { CategoryModule } from './modules/category/category.module';
import { TourImageModule } from './modules/tour-image/tour-image.module';
import { TourScheduleModule } from './modules/tour-schedule/tour-schedule.module';
import { LocationModule } from './modules/location/location.module';
import { DepartureLocationModule } from './modules/departure-location/departure-location.module';
import { ReviewModule } from './modules/review/review.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbOptions } from './db/data-source';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbOptions),
    TourModule,
    BookingModule,
    CategoryModule,
    TourImageModule,
    TourScheduleModule,
    LocationModule,
    DepartureLocationModule,
    ReviewModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
