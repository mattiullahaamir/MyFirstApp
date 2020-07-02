import { Injectable, Inject } from '@nestjs/common';
import { Accounts } from '../../accounts.entity';
//import { Accounts } from './accounts.entity';

@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNTS_REPOSITORY')
    private accountsRepository: typeof Accounts,
  ) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async create(UserId: number): Promise<object> {
    const account = {
      Name: 'Account',
      Type: 'Personal Account',
      Balance: 100,
      UserId: UserId,
    };
    const newAccount: any = await this.accountsRepository.create<Accounts>(
      account,
    );

    if (newAccount) {
      return {
        ...account,
        id: newAccount.id,
      };
    }
  }

  // get Accounts By User Id
  public async getAccountsByUserId(UserId: number): Promise<object> {
    const accounts = await Accounts.findAll<Accounts>({
      where: { UserId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    return accounts ? accounts : [];
  }
}
