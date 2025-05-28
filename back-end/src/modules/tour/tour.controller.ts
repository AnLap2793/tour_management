import { Controller } from '@nestjs/common';
import { TourService } from './tour.service';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}
}
