import { Controller, Patch, Body, BadRequestException } from '@nestjs/common';
import { TimezoneService } from './timezone.service';

@Controller('api')
export class TimezoneController {
  constructor(private readonly timezoneService: TimezoneService) {}

  @Patch('update-timezone')
  async updateTimezone(@Body('timezone') timezone: string, @Body('userId') userId: string) {
    if (!this.timezoneService.isValidTimezone(timezone)) {
      throw new BadRequestException('Invalid timezone.');
    }
    const result = await this.timezoneService.updateUserTimezone(userId, timezone);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return result;
  }
}

