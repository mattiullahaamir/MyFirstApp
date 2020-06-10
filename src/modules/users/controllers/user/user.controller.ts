import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { IUsers } from '../../interfaces/users.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  public async register(@Body() user: IUsers): Promise<any> {
    const result: any = await this.userService.create(user);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  // get all user data
  @Get('')
  public async getAllUser(): Promise<any> {
    return await this.userService.getAllUser();
  }

  // get single user data
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

  // delete user
  @Delete(':id')
  public async deleteUser(@Param('id') dltId: string): Promise<any> {
    return await this.userService.deleteUser(dltId);
  }
}
