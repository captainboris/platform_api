import { Query, Resolver } from '@nestjs/graphql';
import * as moment from 'moment-timezone';

@Resolver()
export class TimezoneResolver {
    @Query(() => [String], { description: "Get a list of all available timezones" })
    getTimezones(): string[] {
        return moment.tz.names();
    }
}
