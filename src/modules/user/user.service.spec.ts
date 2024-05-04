import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: Partial<Repository<User>>;

  beforeEach(async () => {
    userRepositoryMock = {
      create: jest.fn().mockImplementation((entity) => entity),
      save: jest.fn().mockImplementation(async (entity) => entity),
      update: jest.fn().mockReturnValue({ affected: 1 }),
      delete: jest.fn().mockReturnValue({ affected: 1 }),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockImplementation(({ where }) => {
        return { id: where.id, email: where.email, lastLoginTime: new Date('2020-01-01T00:00:00Z'), timezone: 'UTC' };
      })
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update timezone and convert lastLoginTime to UTC on create', async () => {
    const user: Partial<User> = { 
        lastLoginTime: new Date('2021-05-05T12:00:00Z'),
        timezone: 'America/New_York'
    };
    await service.create(user as DeepPartial<User>);
    expect(userRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
      lastLoginTime: expect.any(Date)
    }));
  });

  it('should update user with new timezone and convert lastLoginTime', async () => {
    const user: Partial<User> = { 
        lastLoginTime: new Date('2021-05-05T12:00:00Z'),
        timezone: 'America/New_York' 
    };
    const result = await service.update('1', user as DeepPartial<User>);
    expect(result).toBeTruthy();
    expect(userRepositoryMock.update).toHaveBeenCalledWith('1', expect.objectContaining({
      lastLoginTime: expect.any(Date) 
    }));
  });

  it('should return all users and convert lastLoginTime to local time', async () => {
    const users = await service.findAll();
    expect(users).toEqual(expect.any(Array));
    expect(users.every(u => u.lastLoginTime instanceof Date)).toBeTruthy();
  });
});
