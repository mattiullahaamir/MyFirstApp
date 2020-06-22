import { Controller, Get, UseGuards, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/get')
  getNameLength(): number {
    return this.appService.getNameLength();
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('/auth/login')
  // async login(@Request() req) {
  //   console.log(req);

  //   console.log('.........Hi Auth Login...........');
  //   return req.user;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   console.log('.........Hi Profile...........');

  //   return req.user;
  // }
}
