/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
//import { Users } from '';
import * as jwt from 'jsonwebtoken';
//import { jwtConfig } from './../../config/jwtConfig';
import crypto = require('crypto');
import { Users } from '../../users.entity';
import { jwtConfig } from 'src/config/jwtConfig';
import { AccountService } from 'src/modules/accounts/services/account/account.service';
import { IUsers } from '../../interfaces/users.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: typeof Users,
    private accountsService: AccountService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // eslint-disable-next-line @typescript-eslint/ban-types

  public async create(user: any): Promise<any> {
    const exists = await this.usersRepository.findOne({
      where: { Email: user.Email },
    });
    if (exists) {
      throw new Error('This email is already used.');
    } else {
      user.Salt = crypto.randomBytes(128).toString('base64');
      user.Password = crypto
        .createHmac('sha256', user.Password + user.Salt)
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

  // get all user
  public async getAllUser(): Promise<any> {
    const data = await this.usersRepository.findAll({
      where: { deletedAt: null },
    });
    return [...data];
  }

  // get single user
  public async getSingleUser(userId: string): Promise<any> {
    const data = await this.usersRepository.findOne({
      where: {
        id: userId.toString(),
        deletedAt: null,
      },
    });
    if (!data) {
      throw new NotFoundException('User could not found.');
    }
    return { data };
  }

  // update user
  public async updateUser(userId: string, data: Partial<IUsers>): Promise<any> {
    await this.usersRepository.update(data, {
      where: { id: userId.toString() },
    });
    return await this.usersRepository.findOne({
      where: { id: userId.toString() },
    });
  }

  // delete user
  public async deleteUser(dltId: string): Promise<any> {
    const result = await this.usersRepository.destroy({
      where: {
        id: dltId.toString(),
        deletedAt: null,
      },
    });

    if (!result) {
      throw new NotFoundException('User could not found.');
    } else {
      return { isDeleted: 'Record deleted successfully.' };
    }

    // return await this.usersRepository.findOne({
    //   where: {
    //     id: dltId.toString(),
    //     deletedAt: !null,
    //   },
    // });
  }
}
