import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneService } from './timezone.service';
import { UserService } from '../modules/user/user.service';
import { User } from '@/modules/user/models/user.entity';

describe('TimezoneService', () => {
  let service: TimezoneService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimezoneService,
        {
          provide: UserService,
          useValue: {
            find: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TimezoneService>(TimezoneService);
    userService = module.get<UserService>(UserService);
  });

  it('should return user not found if user does not exist', async () => {
    jest.spyOn(userService, 'find').mockResolvedValue(null);
    const result = await service.updateUserTimezone('invalid', 'timezone');
    expect(result).toEqual({ success: false, message: 'User not found.' });
  });

  it('should return failed to update timezone if update fails', async () => {
  jest.spyOn(userService, 'find').mockResolvedValue({
    id: 'a9868b30-51bd-4070-8dbb-043a56e21bcb',
    email: 'wethanw.001@gmail.com',
    password: '123456', 
 }as User); 
  jest.spyOn(userService, 'update').mockResolvedValue(false);
  const result = await service.updateUserTimezone('valid', 'timezone');
  expect(result).toEqual({ success: false, message: 'Failed to update timezone.' });
});

it('should return success message if update succeeds', async () => {
  jest.spyOn(userService, 'find').mockResolvedValue({
    id: 'a9868b30-51bd-4070-8dbb-043a56e21bcb',
    email: 'wethanw.001@gmail.com',
    password: '123456', 
 }as User); 
  jest.spyOn(userService, 'update').mockResolvedValue(true);
  const result = await service.updateUserTimezone('valid', 'timezone');
  expect(result).toEqual({ success: true, message: 'Timezone updated successfully.' });
});
});