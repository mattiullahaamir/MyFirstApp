import { Controller, Get, UseGuards, Post, Request } from '@nestjs/common';
//import { AppService } from "src/app.service";
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginAuth(@Request() req) {
    console.log('.........Hi Auth Login...........');
    //console.log(req.user);

    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    console.log('.........Hi Profile...........');

    return req.user;
  }
}
