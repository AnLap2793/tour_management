import { Controller } from '@nestjs/common';
import { DepartureLocationService } from './departure-location.service';

@Controller('departure-location')
export class DepartureLocationController {
  constructor(private readonly departureLocationService: DepartureLocationService) {}
}
