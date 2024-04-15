import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { CreateUserInput } from '../user/dto/new-user.input';
import {
  ACCOUNT_EXIST,
  ACCOUNT_NOT_EXIST,
  UPDATE_ERROR,
  LOGIN_ERROR,
  NOT_EMPTY,
  REGISTER_ERROR,
  SUCCESS,
} from '@/common/constants/code';
import { Result } from '@/common/dto/result.type';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Mutation(() => Result, { description: 'User login' })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<Result> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return {
        code: ACCOUNT_NOT_EXIST,
        message: "account doesn't exist",
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = this.jwtService.sign({
        id: user.id,
      });
      return {
        code: SUCCESS,
        message: 'login successful',
        data: token,
      };
    }
    return {
      code: LOGIN_ERROR,
      message: 'login failed, wrong password',
    };
  }

  @Mutation(() => Result, { description: 'User register' })
  async register(@Args('input') input: CreateUserInput): Promise<Result> {
    if (!input.email || !input.password || !input.ref || !input.displayName) {
      return {
        code: NOT_EMPTY,
        message: 'some mandatory field is empty',
      };
    }
    const user = await this.userService.findByEmail(input.email);
    if (user) {
      return {
        code: ACCOUNT_EXIST,
        message: 'account already exists',
      };
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const res = await this.userService.create({
      ...input,
      password: hashedPassword,
    });
    if (res) {
      return {
        code: SUCCESS,
        message: 'register successfully',
      };
    }
    return {
      code: REGISTER_ERROR,
      message: 'registration failed',
    };
  }

  @Mutation(() => Result, { description: 'Change password' })
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Context() cxt: any,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<Result> {
    const id = cxt.req.user.id;
    const user = await this.userService.find(id);
    if (!user) {
      return {
        code: ACCOUNT_NOT_EXIST,
        message: "account doesn't exist",
      };
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordValid) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const res = await this.userService.update(id, {password: hashedPassword});
      if (res) {
        return {
          code: SUCCESS,
          message: 'password updated',
        }
      }
      return {
        code: UPDATE_ERROR,
        message: 'password update failed',
      };
    }
    return {
      code: LOGIN_ERROR,
      message: 'the current password is incorrect',
    };
  }
}
