import { UserModel } from './user.model';

describe('UserModel', () => {
  it('should create an instance', () => {
    const model = new UserModel();

    expect(model._id).toEqual('');
    expect(model.username).toEqual('');
  });
});
