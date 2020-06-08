import { Sequelize } from 'sequelize-typescript';
import { Users } from '../users/users.entity';
import { Accounts } from '../accounts/accounts.entity';

export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      sequelize.addModels([Users, Accounts]);
      return sequelize;
    },
  },
];
