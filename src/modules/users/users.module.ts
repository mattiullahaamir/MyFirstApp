import { Module } from '@nestjs/common';
import { UsersProviders } from './users.provider';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  providers: [UsersProviders, UserService],
  imports: [AccountsModule],
  exports: [UsersProviders, UserService],
  controllers: [UserController],
})
export class UsersModule {}
