import { Sequelize } from 'sequelize-typescript';

export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'abc123',
        database: 'BankApp',
      });
      sequelize.addModels([]);
      return sequelize;
    },
  },
];
