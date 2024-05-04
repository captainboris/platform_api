import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './models/user.entity';
import { convertToUTC, convertToLocalTime } from '@/common/utils/time-utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(entity: DeepPartial<User>): Promise<boolean> {
    if (typeof entity.lastLoginTime === 'string' || entity.lastLoginTime instanceof Date) {
      const date = new Date(entity.lastLoginTime); // Safe conversion to Date
      entity.lastLoginTime = entity.timezone ? convertToUTC(date, entity.timezone) : date;
    }

    const res = await this.userRepository.save(
      this.userRepository.create(entity),
    );
    return !!res;
  }

  async del(id: string): Promise<boolean> {
    const res = await this.userRepository.delete(id);
    return res.affected > 0;
  }

  async update(id: string, entity: DeepPartial<User>): Promise<boolean> {
    if (typeof entity.lastLoginTime === 'string' || entity.lastLoginTime instanceof Date) {
      const date = new Date(entity.lastLoginTime); 
      entity.lastLoginTime = entity.timezone ? convertToUTC(date, entity.timezone) : date;
    }

    const res = await this.userRepository.update(id, entity);
    if (res.affected > 0) {
      return true;
    }
    return false;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    users.forEach(user => {
      if (user.lastLoginTime && user.timezone) {
        user.lastLoginTime = convertToLocalTime(user.lastLoginTime, user.timezone);
      }
    });
    return users;
  }

  async find(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (user && user.lastLoginTime && user.timezone) {
      user.lastLoginTime = convertToLocalTime(user.lastLoginTime, user.timezone);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user && user.lastLoginTime && user.timezone) {
      user.lastLoginTime = convertToLocalTime(user.lastLoginTime, user.timezone);
    }
    return user;
  }
}
