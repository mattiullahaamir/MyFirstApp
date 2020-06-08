import { Users } from './users.entity';

export const UsersProviders = {
  provide: 'USERS_REPOSITORY',
  useValue: Users,
};
