import * as moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { ITimezone } from '../common/interfaces/timezone.interface';

@Injectable()
export class TimezoneService {
  constructor(private readonly userService: UserService) {}

  getAllTimezones(): ITimezone[] {
    return moment.tz.names().map(name => ({
      id: name,
      displayName: `${name} (${moment.tz(name).format('Z z')})` 
    }));
  }

  isValidTimezone(timezone: string): boolean {
    return moment.tz.names().includes(timezone);
  }

  // Update the time zone based on the user ID
  async updateUserTimezone(userId: string, timezone: string): Promise<any> {
    const user = await this.userService.find(userId);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const updated = await this.userService.update(userId, { timezone });

    if (!updated) {
      return { success: false, message: 'Failed to update timezone.' };
    }

    return { success: true, message: 'Timezone updated successfully.' };
  }
}
