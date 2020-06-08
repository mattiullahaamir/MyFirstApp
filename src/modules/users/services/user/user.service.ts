/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, Inject } from '@nestjs/common';
//import { Users } from '';
import * as jwt from 'jsonwebtoken';
//import { jwtConfig } from './../../config/jwtConfig';
import crypto = require('crypto');
import { Users } from '../../users.entity';
import { jwtConfig } from 'src/config/jwtConfig';
import { AccountService } from 'src/modules/accounts/services/account/account.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: typeof Users,
    private accountsService: AccountService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async create(user: any): Promise<object> {
    const exists = await Users.findOne({ where: { Email: user.Email } });
    if (exists) {
      throw new Error('This email is already used.');
    } else {
      user.Salt = crypto.randomBytes(128).toString('base64');
      user.Password = crypto
        .createHmac('sha', user.Password + user.Salt)
        .digest('hex');
      const newUser: any = await this.usersRepository.create<Users>(user);
      const jwtToken = jwt.sign(user, process.env.JWT_KEY, jwtConfig);
      newUser.Token = jwtToken;
      if (newUser) {
        this.accountsService.create(newUser.id);
      }
      return newUser;
    }
  }
}
