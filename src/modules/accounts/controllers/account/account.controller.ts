import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from '../../services/account/account.service';

@Controller('account')
export class AccountController {
  constructor(private accountsService: AccountService) {}
  @Post('create-account')
  public async register(@Body() UserId: number): Promise<any> {
    const result: any = await this.accountsService.create(UserId);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
