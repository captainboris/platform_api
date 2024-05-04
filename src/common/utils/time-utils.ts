import * as moment from 'moment-timezone';
import 'moment-timezone/builds/moment-timezone-with-data'; 

export function convertToUTC(localTime: Date, timezone: string): Date {
    return moment(localTime).tz(timezone).utc().toDate();
}

export function convertToLocalTime(utcTime: Date, timezone: string): Date {
    return moment.utc(utcTime).tz(timezone).toDate();
}
