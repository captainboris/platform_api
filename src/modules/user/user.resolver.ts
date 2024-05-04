import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/new-user.input';
import { UserType } from './dto/user.type';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { SkipAuth } from '../auth/skip-auth.decorator';
import { convertToLocalTime } from '@/common/utils/time-utils';

@Resolver(of => UserType) // Ensure to specify what type this resolver is for
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType], { description: 'Get all users' })
  async getUsers(): Promise<UserType[]> {
    const users = await this.userService.findAll();
    // Convert each user's relevant datetime fields
    users.forEach(user => {
      if (user.lastLoginTime && user.timezone) {
        user.lastLoginTime = convertToLocalTime(user.lastLoginTime, user.timezone);
      }
    });
    return users;
  }

  @Query(() => UserType, { description: 'Find user by email' })
  async getUserByEmail(@Args('email') email: string): Promise<UserType> {
    const user = await this.userService.findByEmail(email);
    if (user && user.lastLoginTime && user.timezone) {
      user.lastLoginTime = convertToLocalTime(user.lastLoginTime, user.timezone);
    }
    return user;
  }

  @Query(() => UserType, { description: 'Find user by id' })
  async getUserById(@Args('id') id: string): Promise<UserType> {
    const user = await this.userService.find(id);
    if (user && user.lastLoginTime && user.timezone) {
      user.lastLoginTime = convertToLocalTime(user.lastLoginTime, user.timezone);
    }
    return user;
  }

  @Query(() => UserType, { description: 'Find user by context' })
  async getUserInfo(@Context() ctx: any): Promise<UserType> {
    const id = ctx.req.user.id;
    const user = await this.userService.find(id);
    if (user && user.lastLoginTime && user.timezone) {
      user.lastLoginTime = convertToLocalTime(user.lastLoginTime, user.timezone);
    }
    return user;
  }

  @SkipAuth()
  @Mutation(() => Boolean, { description: 'Create new user' })
  async createUser(@Args('input') input: CreateUserInput): Promise<boolean> {
    return await this.userService.create(input);
  }

  @Mutation(() => Boolean, { description: 'Update user info' })
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<boolean> {
    return await this.userService.update(id, input);
  }

  @Mutation(() => Boolean, { description: 'Hard delete an user' })
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return await this.userService.del(id);
  }
}
