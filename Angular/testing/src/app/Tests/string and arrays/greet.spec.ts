import { greet } from './greet';

describe('greet', () => {
  it('should include specified name in greeting message.', () => {
    let name = 'username';
    const result = greet(name);

    expect(result).toContain('username');
  });
});
