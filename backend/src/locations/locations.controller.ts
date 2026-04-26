import { Controller, Get } from '@nestjs/common';
import { ok } from '../common/api-response';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('sensors')
  async getSensorLocations() {
    const data = await this.locationsService.getSensorLocations();
    return ok(data);
  }
}
