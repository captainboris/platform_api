import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneController } from './timezone.controller';
import { TimezoneService } from './timezone.service';
import { BadRequestException } from '@nestjs/common';

describe('TimezoneController', () => {
  let controller: TimezoneController;
  let service: TimezoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimezoneController],
      providers: [
        {
          provide: TimezoneService,
          useValue: {
            isValidTimezone: jest.fn(),
            updateUserTimezone: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TimezoneController>(TimezoneController);
    service = module.get<TimezoneService>(TimezoneService);
  });

  it('should throw BadRequestException if timezone is invalid', async () => {
    jest.spyOn(service, 'isValidTimezone').mockReturnValue(false);
    await expect(controller.updateTimezone('invalid', 'userId')).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if updateUserTimezone fails', async () => {
    jest.spyOn(service, 'isValidTimezone').mockReturnValue(true);
    jest.spyOn(service, 'updateUserTimezone').mockResolvedValue({ success: false, message: 'Failed to update timezone.' });
    await expect(controller.updateTimezone('valid', 'userId')).rejects.toThrow(BadRequestException);
  });

  it('should return result if timezone is valid and updateUserTimezone succeeds', async () => {
    const result = { success: true, message: 'Timezone updated successfully.' };
    jest.spyOn(service, 'isValidTimezone').mockReturnValue(true);
    jest.spyOn(service, 'updateUserTimezone').mockResolvedValue(result);
    await expect(controller.updateTimezone('valid', 'userId')).resolves.toEqual(result);
  });
});