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
  Res,
  Headers,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { IUsers } from '../../interfaces/users.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  public async register(@Res() res, @Body() user: IUsers): Promise<any> {
    const result: any = await this.userService.create(user);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return res.status(HttpStatus.OK).json(result);
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

  //login
  @Post('login')
  public async login(@Res() res, @Body() credentials: any): Promise<any> {
    const result: any = await this.userService.login(credentials);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  //authentication
  @Post(':id')
  public async authenticate(
    @Param() param,
    @Res() res,
    @Headers() headers,
  ): Promise<any> {
    const token = headers.authorization.replace('Bearer ', '');

    const result: any = await this.userService.authenticate(param.id, token);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return res.status(HttpStatus.OK).json(result);
  }
}
