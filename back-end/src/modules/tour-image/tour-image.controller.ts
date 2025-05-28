import { Controller } from '@nestjs/common';
import { TourImageService } from './tour-image.service';

@Controller('tour-image')
export class TourImageController {
  constructor(private readonly tourImageService: TourImageService) {}
}
