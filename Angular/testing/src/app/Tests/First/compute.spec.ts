import { compute } from './first';

describe('Compute', () => {
  it('should return 0 if input is negative', () => {
    const result = compute(-1);
    expect(result).toBe(0);
  });
  it('should return input if input is greater or equal to 0', () => {
    const result = compute(1);
    expect(result).toBe(1);
  });
});
