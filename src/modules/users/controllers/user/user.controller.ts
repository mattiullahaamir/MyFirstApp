import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { IUsers } from '../../interfaces/users.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  public async register(@Body() user: IUsers): Promise<any> {
    const result: any = await this.userService.create(user);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  // get all user data
  @Get('alluser')
  public async getAllUser(): Promise<any> {
    return await this.userService.getAllUser();
  }

  // get all user data
  @Get(':id')
  public async getSingleUser(@Param('id') userId: string): Promise<any> {
    return await this.userService.getSingleUser(userId);
  }

  // update user
  @Put(':id')
  public async updateUser(
    @Param('id') userid: string,
    @Body() data: Partial<IUsers>,
  ): Promise<any> {
    return this.userService.updateUser(userid, data);
  }

  // for checking purpose
  @Get('check')
  public getName(): string {
    const name: any = this.userService.getMessage();

    if (name.success) {
      return name;
    } else {
      throw new HttpException(name.message, HttpStatus.BAD_REQUEST);
    }
  }
}
