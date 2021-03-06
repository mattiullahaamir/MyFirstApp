/* eslint-disable @typescript-eslint/ban-types */
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
  TableOptions,
  DeletedAt,
} from 'sequelize-typescript';
import { Accounts } from '../accounts/accounts.entity';

//import { TableOptions } from 'sequelize-typescript';

const tableOptions: TableOptions = {
  timestamp: true,
  tableName: 'Users',
} as TableOptions;
@Table(tableOptions)
export class Users extends Model<Users> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column({
    type: DataType.CHAR(200),
    allowNull: false,
  })
  public Username: string;

  @Column({
    allowNull: false,
    validate: {
      isEmail: true,
      isUnique: async (value: string, next: Function): Promise<any> => {
        const exists = await Users.findOne({ where: { Email: value } });
        if (exists) {
          const error = new Error('This email is already used.');
          next(error);
        }
        next();
      },
    },
  })
  public Email: string;

  @Column({
    type: DataType.CHAR(200),
    allowNull: false,
  })
  public Password: string;

  @Column({
    type: DataType.CHAR(200),
    allowNull: true,
  })
  public Salt: string;

  // delete flag
  // @Column({
  //   type: DataType.BOOLEAN,
  //   defaultValue: false,
  //   allowNull: false,
  //   set: function(value) {
  //     if (value === 'true') value = true;
  //     if (value === 'false') value = false;
  //     this.setDataValue('hidden', value);
  //   },
  // })
  // public isDeleted: boolean;

  paranoid: true;
  timestamps: true;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;

  @DeletedAt
  public deletedAt: Date;

  @HasMany(() => Accounts, 'UserId')
  public Accounts: Accounts[];
}
