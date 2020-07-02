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
import { Accounts } from 'src/modules/accounts/accounts.entity';

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
      return {
        success: false,
        message: 'This email is already exists.',
      };
    } else {
      user.Salt = crypto.randomBytes(128).toString('base64');
      //console.log('before hash - password - [' + user.Password + ' ]');

      user.Password = crypto
        .createHmac('sha256', user.Password + user.Salt)
        .digest('hex')
        .trim();

      //console.log('after hash - password - [' + user.Password + ' ]');

      const newUser: any = await this.usersRepository.create<Users>(user);
      const jwtToken = jwt.sign(
        { id: user.id, username: user.Username, email: user.Email },
        process.env.JWT_KEY,
        jwtConfig,
      );

      newUser.Token = jwtToken;
      if (newUser) {
        const account = await this.accountsService.create(newUser.id);
        const accounts = [account];
        const response = {
          user: {
            id: newUser.id,
            username: newUser.Username.trim(),
            email: newUser.Email.trim(),
            accounts,
          },
          token: jwtToken,
          success: true,
        };
        return response;
      }
      return {
        success: false,
        message: 'Creating new user went wrong',
      };
    }
  }

  // get all user
  public async getAllUser(): Promise<any> {
    const data = await this.usersRepository.findAll({
      where: { deletedAt: null },
    });
    return [...data];
  }

  // get single user using [id]
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
    //console.log(data.Username);

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

  // login function
  public async login(credentials: any): Promise<object> {
    const user = await this.usersRepository.findOne<Users>({
      where: {
        Username: credentials.Username,
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!user) {
      return {
        success: false,
        message: 'User does not exists.',
      };
    }

    const inputPassword = crypto
      .createHmac('sha256', credentials.Password + user.Salt.trim())
      .digest('hex');

    const isPasswordCorrect = user.Password.trim() === inputPassword.trim();

    if (!isPasswordCorrect) {
      return {
        success: false,
        message: 'Your password is incorrect.',
      };
    }

    // get the user accounts
    const accounts = await this.accountsService.getAccountsByUserId(user.id);
    // generate the new 'JWT-Token' for login user
    const jwtToken = jwt.sign(
      { id: user.id, username: user.Username, email: user.Email },
      process.env.JWT_KEY,
      {
        algorithm: 'HS256',
        expiresIn: '1 day',
      },
    );

    const response = {
      user: {
        id: user.id,
        username: user.Username.trim(),
        email: user.Email.trim(),
        accounts,
      },
      token: jwtToken,
      success: true,
    };
    return response;
  }

  // user authentication

  public async authenticate(id: number, token: string): Promise<any> {
    const user = await this.usersRepository.findOne<Users>({
      where: {
        id,
      },
      include: [{ model: Accounts, where: { UserId: id }, required: true }],
    });

    //decode the jwt token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY, jwtConfig);
    const isTokenValid = decodedToken.id === Number(id);

    if (!isTokenValid) {
      return {
        success: false,
        message: 'User is not authorized.',
      };
    }

    const response = {
      user: {
        id: user.id,
        username: user.Username.trim(),
        email: user.Email.trim(),
        accounts: user.Accounts,
      },
      token,
      success: true,
    };
    return response;
  }
}
