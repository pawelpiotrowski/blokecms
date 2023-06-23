import { User } from 'shared-lib';

export class UserModel implements User {
  _id = '';
  username = '';
  isAdmin = false;
}
