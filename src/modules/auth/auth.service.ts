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
    console.log('username ' + username + ' password ' + password);

    const user = await this.userService.findOneUser(username);

    // const valueCheck = Buffer.from(user.data.Password, 'hex');
    // console.log('valueCheck [' + valueCheck + ' ]');
    console.log('Salt -> :  [ ' + user.data.Salt + ' ].');
    //return user;
    //user.data.Salt = crypto.randomBytes(128).toString('base64');
    //const salt = crypto.randomBytes(128).toString('base64');

    const _password = crypto
      .createHmac('sha256', password + user.data.Salt)
      .digest('hex')
      .trim();

    // const _password2 = crypto
    //   .createHmac('sha256', password + user.data.Salt)
    //   .digest('hex')
    //   .trim();

    console.log('hash - password - ' + _password);

    // console.log('hash - password2 - [' + _password2 + ' ]');

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
    console.log('login called');

    console.log('payload user: \n' + user);

    const payload = { username: user.data.Username, sub: user.Id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
