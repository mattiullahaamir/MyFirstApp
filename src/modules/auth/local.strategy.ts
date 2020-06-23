import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // console.log(
    //   username +
    //     password +
    //     ' .................pyeeeeeeeeeeeeeeeeeeee............',
    // );

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      console.log('exception called');

      throw new UnauthorizedException();
    }
    console.log('user from local : ' + user);

    return user;
  }
}
