import { Controller } from '@nestjs/common';
import { TourScheduleService } from './tour-schedule.service';

@Controller('tour-schedule')
export class TourScheduleController {
  constructor(private readonly tourScheduleService: TourScheduleService) {}
}
