import { UserRepo } from './user-repo';

describe('UserRepo', () => {
  it('should be defined', () => {
    expect(new UserRepo()).toBeDefined();
  });
});
