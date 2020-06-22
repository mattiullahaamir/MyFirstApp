import { Injectable } from '@nestjs/common';
import { UserService } from '../users/services/user/user.service';
//import { UserService } from '../users/users.service';
import crypto = require('crypto');
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    //console.log('username ' + username + ' password ' + password);

    const user = await this.userService.findOneUser(username);

    console.log(user.data.Username);
    //return user;
    //user.Salt = crypto.randomBytes(128).toString('base64');
    //const salt = crypto.randomBytes(128).toString('base64');

    const _password = crypto
      .createHmac('sha256', password + user.data.Salt)
      .digest('hex');

    console.log('hash - password - ' + _password);

    //const match = await crypto.timingSafeEqual(pass, user.Password);
    console.log(user.data.Password + ' === ' + _password);

    if (user && user.data.Password === _password) {
      const { password, ...result } = user;
      console.log(' RESULT ----->  ' + result);

      return result;
    }
    return null;
  }

  //login function
  /**
   *
   * sub = to get the [ userid] from database.?.
   */
  async login(user: any) {
    const payload = { username: user.Username, sub: user.Id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
