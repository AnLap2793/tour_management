import { Injectable } from '@nestjs/common';
import { Booking } from 'src/entities/booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  findAll() {
    return this.bookingRepository.find();
  }
}
