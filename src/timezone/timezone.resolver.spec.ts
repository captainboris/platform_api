import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneResolver } from './timezone.resolver';

describe('TimezoneResolver', () => {
    let resolver: TimezoneResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TimezoneResolver],
        }).compile();

        resolver = module.get<TimezoneResolver>(TimezoneResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should return a list of timezones', () => {
        const timezones = resolver.getTimezones();
        expect(timezones).toBeInstanceOf(Array);
        expect(timezones).toEqual(expect.arrayContaining(['UTC', 'America/New_York']));
    });
});
