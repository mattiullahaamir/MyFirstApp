import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account/account.controller';
import { AccountService } from './services/account/account.service';
import { DatabaseModule } from '../database/database.module';
import { AccountsProviders } from './accounts.provider';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountsProviders],
  imports: [DatabaseModule],
  exports: [AccountsProviders, AccountService],
})
export class AccountsModule {}
