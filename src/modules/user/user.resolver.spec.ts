import { convertToLocalTime } from '@/common/utils/time-utils';
import * as moment from 'moment-timezone';

//Change the timezone to 'America/New_York'
moment.tz.setDefault('America/New_York');

describe('Time Conversion Utility', () => {     
  it('should convert UTC time to Eastern Standard Time correctly', () => {
    const utcTime = new Date('2021-01-01T12:00:00Z');
    const timezone = 'America/New_York';  // Eastern Standard Time (EST)
    const expectedLocalTimeString = '2021-01-01T07:00:00';  // EST is UTC-5

    const convertedTime = convertToLocalTime(utcTime, timezone);

    expect(moment(convertedTime).format('YYYY-MM-DDTHH:mm:ss')).toEqual(expectedLocalTimeString);
  });

  it('should handle daylight saving time adjustments for Eastern Daylight Time', () => {
    const utcTime = new Date('2021-06-01T12:00:00Z');
    const timezone = 'America/New_York';  // Eastern Daylight Time (EDT)
    const expectedLocalTimeString = '2021-06-01T08:00:00';  // EDT is UTC-4

    const convertedTime = convertToLocalTime(utcTime, timezone);

    expect(moment(convertedTime).format('YYYY-MM-DDTHH:mm:ss')).toEqual(expectedLocalTimeString);
  });

  it('should return the original time if the timezone is UTC', () => {
    const utcTime = new Date('2021-01-01T12:00:00Z');
    const timezone = 'UTC';

    const convertedTime = convertToLocalTime(utcTime, timezone);

    expect(moment(convertedTime).toISOString()).toEqual(utcTime.toISOString());
  });
});
