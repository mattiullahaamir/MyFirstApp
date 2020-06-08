import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Get,
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

  @Get('check')
  public getName(): string {
    return 'Aamir Qureshi';
  }
}
